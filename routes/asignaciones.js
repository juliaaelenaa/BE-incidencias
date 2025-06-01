const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

// POST
router.post('/', async (req, res) => {
  const { TareaID, UsuarioID } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('TareaID', sql.Int, TareaID)
      .input('UsuarioID', sql.Int, UsuarioID)
      .query('INSERT INTO Asignaciones (TareaID, UsuarioID) VALUES (@TareaID, @UsuarioID)');
    res.send('Tarea asignada al usuario');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
