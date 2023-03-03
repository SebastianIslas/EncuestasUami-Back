const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(function (req, res, next) {
  console.log('Request URL:', req.originalUrl);
  console.log('Time:', Date.now());
  next();
});

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
router.put('/admin/licenciatura/:idLic', PlanEstudiosCtrl.editarLicenciatura);
router.delete('/admin/licenciatura/:idLic', PlanEstudiosCtrl.eliminarLicenciatura);

// Servicios temporales /////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/licenciatura/:id_lic', PlanEstudiosCtrl.getLicenciatura);
router.post('/materia/:id_lic', PlanEstudiosCtrl.getCursos);
router.post('/admin/licenciatura/agregarYCrearMateriaALic/:id_lic', PlanEstudiosCtrl.postAgregarMateriaALicenciatura);
router.delete('/admin/licenciatura/eliminarMateria',PlanEstudiosCtrl.removeCursoFromLicenciatura);
router.put('/admin/licenciatura/materias/agregarProfesor/:id_Materia/:claveEmpleado', PlanEstudiosCtrl.asignarProfesorAMateria)
router.get('/admin/licenciatura/materias/consultarProfesores/:id_materia', PlanEstudiosCtrl.getProfesoresFromCurso)
router.delete('/admin/licenciatura/materias/removerProfesorFromCurso/:id_materia/:claveEmpleado', PlanEstudiosCtrl.removerProfesorFromCurso)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var AlumnoCtrl = require('../controllers/alumnoCtrl');
router.post('/alumno/crearAlumno', AlumnoCtrl.crearAlumno);
router.post('/alumno/login', AlumnoCtrl.logInAlumno); //login del alumno
router.get('/alumno/:matricula', AlumnoCtrl.recuperarAlumno); // Servicio temporal para mostar el alumno
router.get('/alumno/encuesta/:matricula/:id_licenciatura', AlumnoCtrl.obtenerEncuestAlumno);
router.get('/alumno/login/recuperar/:matricula', AlumnoCtrl.recuperarPassword);
router.post('/alumno/login/reestablecer', AlumnoCtrl.reestablecerPassword);

var EncuestasCtrl = require('../controllers/encuestasCtrl');
router.post('/administrador/encuesta/iniciar', EncuestasCtrl.iniciarEncuesta);
router.patch('/administrador/encuesta/desactivar/:periodo', EncuestasCtrl.desactivarEncuesta);
router.get('/administrador/encuesta/:periodo', EncuestasCtrl.recuperarEncuesta); // Servicio temporal
router.post('/admin/encuesta', EncuestasCtrl.crearEncuesta);
router.delete('/admin/encuesta/:idEncuesta', EncuestasCtrl.eliminarEncuesta);
router.put('/admin/encuesta/:idEncuesta', EncuestasCtrl.editarEncuesta);

var EncuestasResCtrl = require('../controllers/encuestasResCtrl');
//router.post('/alumno/:matricula/:id_licenciatura/encuestaResuelta', EncuestasResCtrl.agregarEncuestaResVacia); // Servicio temporal
router.post('/encuestaResuelta', EncuestasResCtrl.guardarEncuestaResuelta);

var ProfesorCtrl = require('../controllers/profesorCtrl');
router.post('/admin/profesor/crearProfesor', ProfesorCtrl.crearProfesor); 
router.delete('/admin/profesor/eliminarProfesor/:claveEmpleado', ProfesorCtrl.eliminarProfesor);

var CursoCtrl = require('../controllers/cursosCtrl');
router.put('/admin/curso/:idCurso', CursoCtrl.editarCurso); 

module.exports = router;
