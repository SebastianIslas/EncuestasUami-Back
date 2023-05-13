const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const AlumnoCtrl = require('../controllers/alumnoCtrl');
router.post('/login', AlumnoCtrl.logInAlumno);
router.get('/login/recuperar/:matricula', AlumnoCtrl.recuperarPassword);
router.post('/login/reestablecer', AlumnoCtrl.reestablecerPassword);
router.post('/crear', AlumnoCtrl.crearAlumnoConConfirmacion);
router.get('/valida', AlumnoCtrl.confirmarEmail);
router.post('/alumno/crearAlumno', AlumnoCtrl.crearAlumno);
router.get('/:matricula', AlumnoCtrl.recuperarAlumno);
router.get('/encuesta/:matricula/:id_licenciatura', AlumnoCtrl.obtenerEncuestAlumno);


const EncuestasResCtrl = require('../controllers/encuestasResCtrl');
//Creo esos eran de prueba antes de hacer el de guardarEncuestaResuelta
//router.post('/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.agregarEncuestaResVacia);
//router.post('/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.recibirEncuestaResuelta);
router.post('/encuestaResuelta', EncuestasResCtrl.guardarEncuestaResuelta);
router.get('/ultimaEncuestaRes/:periodo/:matricula', EncuestasResCtrl.consultarUltimaEncuestaRes);
router.get('/encuestasRes/:matricula', EncuestasResCtrl.consultarEncuestasRes);

module.exports = router;

