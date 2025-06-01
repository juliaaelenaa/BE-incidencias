const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', require('./routes/usuarios'));
app.use('/tareas', require('./routes/tareas'));
app.use('/comentarios', require('./routes/comentarios'));
app.use('/asignaciones', require('./routes/asignaciones'));
app.use('/notificaciones', require('./routes/notificaciones'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
