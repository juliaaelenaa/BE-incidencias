// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Rutas
// app.use('/usuarios', require('./routes/usuarios'));
// app.use('/tareas', require('./routes/tareas'));
// app.use('/comentarios', require('./routes/comentarios'));
// app.use('/asignaciones', require('./routes/asignaciones'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Servidor back onlinee http://localhost:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('Paso 1: Express y dotenv cargados');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Paso 2: Iniciando carga de rutas');

app.use('/usuarios', require('./routes/usuarios'));
console.log('Ruta /usuarios cargada');

app.use('/tareas', require('./routes/tareas'));
console.log('Ruta /tareas cargada');

app.use('/comentarios', require('./routes/comentarios'));
console.log('Ruta /comentarios cargada');

app.use('/asignaciones', require('./routes/asignaciones'));
console.log('Ruta /asignaciones cargada');


app.use('/notificaciones', require('./routes/notificaciones'));



const PORT = process.env.PORT || 5001;
console.log('Paso 3: Ejecutando app.listen');

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
