const express = require('express');
const router = express.Router();
const { sql, config } = require('../db');

// GET all tareas
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Tareas');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//  GET /tareas/filtro?estado
router.get('/filtro', async (req, res) => {
  const { estado, prioridad, usuario } = req.query;
  let query = 'SELECT * FROM Tareas WHERE 1=1';

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    if (estado) {
      query += ' AND Estado = @Estado';
      request.input('Estado', sql.NVarChar, estado);
    }

    if (prioridad) {
      query += ' AND Prioridad = @Prioridad';
      request.input('Prioridad', sql.NVarChar, prioridad);
    }

    if (usuario) {
      query += ' AND CreadorID = @UsuarioID';
      request.input('UsuarioID', sql.Int, parseInt(usuario));
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear tarea
router.post('/', async (req, res) => {
  const { Titulo, Descripcion, Prioridad, FechaLimite, CreadorID } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Titulo', sql.NVarChar, Titulo)
      .input('Descripcion', sql.NVarChar, Descripcion)
      .input('Prioridad', sql.NVarChar, Prioridad)
      .input('FechaLimite', sql.Date, FechaLimite)
      .input('CreadorID', sql.Int, CreadorID)
      .query(`
        INSERT INTO Tareas (Titulo, Descripcion, Prioridad, FechaLimite, CreadorID)
        VALUES (@Titulo, @Descripcion, @Prioridad, @FechaLimite, @CreadorID)
      `);
    res.send('Tarea creada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT actualizar estado de tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Estado } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('Estado', sql.NVarChar, Estado)
      .input('TareaID', sql.Int, id)
      .query('UPDATE Tareas SET Estado = @Estado WHERE TareaID = @TareaID');
    res.send('Estado de tarea actualizado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE eliminar tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('TareaID', sql.Int, id)
      .query('DELETE FROM Tareas WHERE TareaID = @TareaID');
    res.send('Tarea eliminada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// GET /tareas/reportes
router.get('/reportes', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN Estado = 'Completado' THEN 1 ELSE 0 END) AS completadas,
        SUM(CASE WHEN Estado != 'Completado' THEN 1 ELSE 0 END) AS pendientes
      FROM Tareas
    `);
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
