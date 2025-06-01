const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const bcrypt = require('bcrypt');

// GET /usuarios
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error en /usuarios:', err);
    res.status(500).send(err.message);
  }
});

// POST con contraseña encriptada
router.post('/', async (req, res) => {
  const { Nombre, Correo, Contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(Contrasena, 10); 
    const pool = await sql.connect(config);
    await pool.request()
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Correo', sql.NVarChar, Correo)
      .input('Contrasena', sql.NVarChar, hashedPassword)
      .query('INSERT INTO Usuarios (Nombre, Correo, Contrasena) VALUES (@Nombre, @Correo, @Contrasena)');
    res.send('Usuario registrado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST con verificación de contraseña encriptada
router.post('/login', async (req, res) => {
  const { Correo, Contrasena } = req.body;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Correo', sql.NVarChar, Correo)
      .query('SELECT * FROM Usuarios WHERE Correo = @Correo');

    if (result.recordset.length === 0) {
      return res.json({ login: false, mensaje: 'Correo no registrado' });
    }

    const usuario = result.recordset[0];
    const isMatch = await bcrypt.compare(Contrasena, usuario.Contrasena);

    if (isMatch) {
      res.json({ login: true, usuario });
    } else {
      res.json({ login: false, mensaje: 'Contraseña incorrecta' });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
