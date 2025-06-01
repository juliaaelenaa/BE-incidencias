
const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

// GET comentarios por tarea
router.get('/:tareaId', async (req, res) => {
  const { tareaId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('TareaID', sql.Int, tareaId)
      .query('SELECT * FROM Comentarios WHERE TareaID = @TareaID ORDER BY Fecha DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST nuevo comentario
router.post('/', async (req, res) => {
  const { TareaID, UsuarioID, Texto } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('TareaID', sql.Int, TareaID)
      .input('UsuarioID', sql.Int, UsuarioID)
      .input('Texto', sql.NVarChar, Texto)
      .query('INSERT INTO Comentarios (TareaID, UsuarioID, Texto, Fecha) VALUES (@TareaID, @UsuarioID, @Texto, GETDATE())');
    res.send('Comentario agregado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
