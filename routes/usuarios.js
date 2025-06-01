const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT UsuarioID, Nombre, Correo FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Nombre, Correo, Contrasena } = req.body;
  try {
    const pool = await sql.connect(config);
    if (Contrasena) {
      const hashedPassword = await bcrypt.hash(Contrasena, 10);
      await pool.request()
        .input('id', sql.Int, id)
        .input('Nombre', sql.NVarChar, Nombre)
        .input('Correo', sql.NVarChar, Correo)
        .input('Contrasena', sql.NVarChar, hashedPassword)
        .query('UPDATE Usuarios SET Nombre = @Nombre, Correo = @Correo, Contrasena = @Contrasena WHERE UsuarioID = @id');
    } else {
      await pool.request()
        .input('id', sql.Int, id)
        .input('Nombre', sql.NVarChar, Nombre)
        .input('Correo', sql.NVarChar, Correo)
        .query('UPDATE Usuarios SET Nombre = @Nombre, Correo = @Correo WHERE UsuarioID = @id');
    }
    res.send('Usuario actualizado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE UsuarioID = @id');
    res.send('Usuario eliminado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
