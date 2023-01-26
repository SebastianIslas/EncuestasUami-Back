const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crear un nuevo usuario EN DESARROLLO
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], crearUsuario );

// Login de usuario EN DESARROLLO
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], loginUsuario );

// Validar y revalidar token
router.get( '/renew', validarJWT , revalidarToken );


/**
 * Rutas pertenecientes al modelo PlanEstudios
 *  -Rutas: 
 *      - [ HTTP | POST ] Obtiene los datos de estudio de una carrera          /    Cambiar a [ HTTP | GET ]  /
 *      - [ HTTP | POST ] Agrega una materia a un plan de estudios en particular
 *      - [ HTTP | DELETE ] Borra una materia de un plan de estudios de una carrera
 *      
 * 
 * 
 */
var PlanEstudiosCtrl = require('../controllers/licenciaturaCtrl');
router.post('/admin/materias/crear', PlanEstudiosCtrl.crearCurso);
router.delete('/admin/materias/eliminar/:clave_materia',PlanEstudiosCtrl.eliminarCurso);
router.post('/admin/licenciatura/crear', PlanEstudiosCtrl.agregarLicenciatura)
router.put('/admin/licenciatura/agregarMateriaExistenteALic/:id_lic/:id_Materia', PlanEstudiosCtrl.agregarMateriaExistenteALicenciatura);

// Servicios temporales /////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/licenciatura/:id_lic', PlanEstudiosCtrl.getLicenciatura);
router.post('/materia/:id_lic', PlanEstudiosCtrl.getCursos);
router.post('/admin/licenciatura/agregarYCrearMateriaALic/:id_lic', PlanEstudiosCtrl.postAgregarMateriaALicenciatura);
router.delete('/admin/licenciatura/eliminarMateria',PlanEstudiosCtrl.removeCursoFromLicenciatura);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var AlumnoCtrl = require('../controllers/alumnoCtrl');
router.post('/alumno/crearAlumno', AlumnoCtrl.crearAlumno);
router.get('/alumno/:matricula', AlumnoCtrl.recuperarAlumno); // Servicio temporal para mostar el alumno
router.get('/alumno/encuesta/:matricula/:id_licenciatura', AlumnoCtrl.obtenerEncuestAlumno);

var EncuestasCtrl = require('../controllers/encuestasCtrl');
router.post('/administrador/encuesta/iniciar', EncuestasCtrl.iniciarEncuesta);
router.patch('/administrador/encuesta/desactivar/:periodo', EncuestasCtrl.desactivarEncuesta);
router.get('/administrador/encuesta/:periodo', EncuestasCtrl.recuperarEncuesta); // Servicio temporal


var EncuestasResCtrl = require('../controllers/encuestasResCtrl');
router.post('/alumno/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.agregarEncuestaResVacia); // Servicio temporal
router.post('/alumno/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.recibirEncuestaResuelta);


module.exports = router;
