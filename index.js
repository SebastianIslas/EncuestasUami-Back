const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { dbConnection } = require('./db/config');
const bodyParser = require('body-parser')
    // Crear el servidor/aplicación de express
const app = express();

// Obtener variable del archivo .env
require('dotenv').config();

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
router.use(function(req, _, next) {
    var body = null;
    try {
        body = req.body;
    } finally {
        console.log({
            'URL': req.originalUrl,
            'Body': body,
            'Time': Date.now()
        });
    }

    next();
});


router.use('/', require('./routes/auth'));


// Rutas
// Rutas para el JWT
router.use('/auth', require('./routes/auth'));

// Rutas basadas en el rol
router.use('/alumno', require('./routes/alumno'));
router.use('/administrador', require('./routes/administrador'));

// Rutas de Azael
router.use('/azael', require('./routes/estadisticas'))

// URL base
app.use(process.env.BASE_URL, router);


// Correr el servidor en el puerto indicado
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});