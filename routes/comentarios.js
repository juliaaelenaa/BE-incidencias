const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

// POST 
router.post('/', async (req, res) => {
  const { TareaID, UsuarioID, Comentario } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('TareaID', sql.Int, TareaID)
      .input('UsuarioID', sql.Int, UsuarioID)
      .input('Comentario', sql.NVarChar, Comentario)
      .query('INSERT INTO Comentarios (TareaID, UsuarioID, Comentario) VALUES (@TareaID, @UsuarioID, @Comentario)');
    res.send('Comentario agregado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET comentariostareaId
router.get('/:tareaId', async (req, res) => {
  const { tareaId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('TareaID', sql.Int, tareaId)
      .query('SELECT * FROM Comentarios WHERE TareaID = @TareaID');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
