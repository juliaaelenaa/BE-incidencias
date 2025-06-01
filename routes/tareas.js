const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT T.TareaID, T.Titulo, T.Descripcion, T.Prioridad, T.FechaLimite, T.Estado, U.Nombre AS Usuario
      FROM Tareas T
      LEFT JOIN Usuarios U ON T.UsuarioAsignado = U.UsuarioID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', async (req, res) => {
  const { Titulo, Descripcion, Prioridad, FechaLimite, Estado, UsuarioAsignado } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Titulo', sql.NVarChar, Titulo)
      .input('Descripcion', sql.NVarChar, Descripcion)
      .input('Prioridad', sql.NVarChar, Prioridad)
      .input('FechaLimite', sql.Date, FechaLimite)
      .input('Estado', sql.NVarChar, Estado)
      .input('UsuarioAsignado', sql.Int, UsuarioAsignado)
      .query(`INSERT INTO Tareas (Titulo, Descripcion, Prioridad, FechaLimite, Estado, UsuarioAsignado)
              VALUES (@Titulo, @Descripcion, @Prioridad, @FechaLimite, @Estado, @UsuarioAsignado)`);
    res.send('Tarea registrada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Titulo, Descripcion, Prioridad, FechaLimite, Estado, UsuarioAsignado } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('Titulo', sql.NVarChar, Titulo)
      .input('Descripcion', sql.NVarChar, Descripcion)
      .input('Prioridad', sql.NVarChar, Prioridad)
      .input('FechaLimite', sql.Date, FechaLimite)
      .input('Estado', sql.NVarChar, Estado)
      .input('UsuarioAsignado', sql.Int, UsuarioAsignado)
      .query(`UPDATE Tareas SET 
                Titulo = @Titulo,
                Descripcion = @Descripcion,
                Prioridad = @Prioridad,
                FechaLimite = @FechaLimite,
                Estado = @Estado,
                UsuarioAsignado = @UsuarioAsignado
              WHERE TareaID = @id`);
    res.send('Tarea actualizada');
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
      .query('DELETE FROM Tareas WHERE TareaID = @id');
    res.send('Tarea eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
