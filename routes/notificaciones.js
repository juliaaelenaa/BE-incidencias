const express = require('express');
const router = express.Router();
const servicio = require('../notificaciones/notificaciones.service');

// POST /notificaciones
router.post('/', async (req, res) => {
  try {
    const nueva = await servicio.create(req.body);
    res.json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /notificaciones/:usuarioId
router.get('/:usuarioId', async (req, res) => {
  try {
    const id = parseInt(req.params.usuarioId);
    const notificaciones = await servicio.findByUsuario(id);
    res.json(notificaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
