const { Router } = require('express');
const router = Router();


const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


var AdministradorCtrl = require('../controllers/administradorCtrl');
router.get('/login', AdministradorCtrl.loginAdmin);
router.get('/login/recuperar/:numEmpleado', AdministradorCtrl.recuperarPasswordAdmin);
router.post('/login/reestablecer', AdministradorCtrl.reestablecerPasswordAdmin);


var PlanEstudiosCtrl = require('../controllers/licenciaturaCtrl');
router.post('/licenciatura/crear', PlanEstudiosCtrl.agregarLicenciatura)
router.put('/licenciatura/agregarMateriaExistenteALic/:id_lic/:id_Materia', PlanEstudiosCtrl.agregarMateriaExistenteALicenciatura);
router.put('/licenciatura/:idLic', PlanEstudiosCtrl.editarLicenciatura);
router.delete('/licenciatura/eliminarMateria', PlanEstudiosCtrl.removeCursoFromLicenciatura);
router.delete('/licenciatura/:idLic', PlanEstudiosCtrl.eliminarLicenciatura);
router.get('/licenciatura/:id_lic', PlanEstudiosCtrl.getLicenciatura);
router.post('/licenciatura/agregarYCrearMateriaALic/:id_lic', PlanEstudiosCtrl.postAgregarMateriaALicenciatura);
router.put('/licenciatura/materias/agregarProfesor/:id_Materia/:claveEmpleado', PlanEstudiosCtrl.asignarProfesorAMateria)
router.get('/licenciatura/materias/consultarProfesores/:id_materia', PlanEstudiosCtrl.getProfesoresFromCurso)
router.delete('/licenciatura/materias/removerProfesorFromCurso/:id_materia/:claveEmpleado', PlanEstudiosCtrl.removerProfesorFromCurso)
router.get('/materia/:id_lic', PlanEstudiosCtrl.getCursos);
router.post('/materias/crear', PlanEstudiosCtrl.crearCurso);
router.delete('/materias/eliminar/:clave_materia', PlanEstudiosCtrl.eliminarCurso);
router.get('/licenciaturas', PlanEstudiosCtrl.getLicenciaturas);


var EncuestasCtrl = require('../controllers/encuestasCtrl');
router.post('/encuesta/iniciar', EncuestasCtrl.iniciarEncuesta);
router.patch('/encuesta/desactivar/:periodo', EncuestasCtrl.desactivarEncuesta);
router.get('/encuesta/activa', EncuestasCtrl.consultarEncuestaActiva);
router.get('/encuesta/:periodo', EncuestasCtrl.recuperarEncuesta);
router.post('/encuesta', EncuestasCtrl.crearEncuesta);
router.delete('/encuesta/:idEncuesta', EncuestasCtrl.eliminarEncuesta);
router.put('/encuesta/:idEncuesta', EncuestasCtrl.editarEncuesta);
router.get('/encuesta/activaLic/:claveLic', EncuestasCtrl.consultarCursosEncuestaActivaLic);
router.get('/encuesta/desactivada/:periodo', EncuestasCtrl.consultarEncuestaDesactivadaPeriodo);


var ProfesorCtrl = require('../controllers/profesorCtrl');
router.post('/profesor/crearProfesor', ProfesorCtrl.crearProfesor);
router.delete('/profesor/eliminarProfesor/:claveEmpleado', ProfesorCtrl.eliminarProfesor);
router.get('/profesores', ProfesorCtrl.getProfesores);
router.put('/profesor/:idProfesor', ProfesorCtrl.editarProfesor);


var CursoCtrl = require('../controllers/cursosCtrl');
router.put('/curso/:idCurso', CursoCtrl.editarCurso);
router.get('/cursos', CursoCtrl.getCursos);



module.exports = router;

