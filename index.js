const express = require('express');
const router = express.Router();
const cors = require('cors');
const { dbConnection } = require('./db/config');
var bodyParser = require('body-parser')

// Obtener variable del archivo .env
require('dotenv').config();

// Crear el servidor/aplicación de express
const app = express();

// Connectarse a la base de datos
dbConnection();


// Directorio Público
app.use(express.static('public'));

// CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parser de diferentes versiones de JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
// Parser de archivos RAW
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// Parser de archivos HTML
app.use(bodyParser.text({ type: 'text/html' }))
// Encoding del parser
app.use(bodyParser.urlencoded({ extended: true }));

// Log de cada petición realizada
router.use(function(req, res, next) {
  console.log('Request URL:', req.originalUrl);
  console.log('Time:', Date.now());
  next();
});

// Rutas
// TODO: Hacer un router por cada controller
router.use('/', require('./routes/auth'));

// URL base
app.use(process.env.BASE_URL, router);

// Correr el servidor en el puerto indicado
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
