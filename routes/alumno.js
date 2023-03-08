const { Router } = require('express');

const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const AlumnoCtrl = require('../controllers/alumnoCtrl');
router.post('/login', AlumnoCtrl.logInAlumno);
router.get('/login/recuperar/:matricula', AlumnoCtrl.recuperarPassword);
router.post('/reestablecer', AlumnoCtrl.reestablecerPassword);
router.post('/crear', AlumnoCtrl.crearAlumno);
router.get('/:matricula', AlumnoCtrl.recuperarAlumno);
router.get('/encuesta/:matricula/:id_licenciatura', AlumnoCtrl.obtenerEncuestAlumno);

const EncuestasResCtrl = require('../controllers/encuestasResCtrl');
router.post('/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.agregarEncuestaResVacia);
router.post('/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.recibirEncuestaResuelta);

module.exports = router;

