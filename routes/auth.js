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
router.post('/PlanEstudios', PlanEstudiosCtrl.getLicenciatura);
router.post('/Cursos', PlanEstudiosCtrl.getCursos);
router.post('/addCurso', PlanEstudiosCtrl.postAgregarMateriaALicenciatura);
router.post('/appendCurso', PlanEstudiosCtrl.postAgregarMateriaExistenteALicenciatura);
router.post('/newCurso', PlanEstudiosCtrl.crearCurso);
router.post('/newLic', PlanEstudiosCtrl.agregarLicenciatura)
router.delete('/del',PlanEstudiosCtrl.removeCursoFromLicenciatura);
router.delete('/delSol',PlanEstudiosCtrl.deleteCurso);

var AlumnoCtrl = require('../controllers/alumnoCtrl');
router.post('/alumno', AlumnoCtrl.getAlumno);
router.post('/agregarAlm', AlumnoCtrl.agregarAlumno);

var EncuestasCtrl = require('../controllers/encuestasCtrl');
router.post('/encuesta', EncuestasCtrl.getEncuesta);
router.post('/abrirEnc', EncuestasCtrl.abrirEncuesta);


module.exports = router;
