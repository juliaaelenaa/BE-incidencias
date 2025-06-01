const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

router.post('/', async (req, res) => {
  const { UsuarioID, Mensaje, Fecha } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('UsuarioID', sql.Int, UsuarioID)
      .input('Mensaje', sql.NVarChar, Mensaje)
      .input('Fecha', sql.DateTime, Fecha || new Date())
      .query('INSERT INTO Notificaciones (UsuarioID, Mensaje, Fecha) VALUES (@UsuarioID, @Mensaje, @Fecha)');
    res.send('Notificación creada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('UsuarioID', sql.Int, usuarioId)
      .query('SELECT * FROM Notificaciones WHERE UsuarioID = @UsuarioID ORDER BY Fecha DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
