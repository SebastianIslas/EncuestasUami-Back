const { Router } = require('express');
const router = Router();


const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWTAlumno } = require('../middlewares/validar-jwt');


// Crear un nuevo usuario EN DESARROLLO
router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
  validarCampos
], crearUsuario);


// Login de usuario EN DESARROLLO
router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
  validarCampos
], loginUsuario);


// Validar y revalidar token
router.get('/renew', validarJWTAlumno, revalidarToken);


module.exports = router;

