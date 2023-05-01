const { Router } = require('express');
const router = Router();


const estadisticasEncustasResueltas = require('../controllers/estadisticas');


router.get('/cursoMasVotado/:periodo', estadisticasEncustasResueltas.getCursoMasVotado);
router.get('/cursoMasVotado/:periodo/:clavelicenciatura', estadisticasEncustasResueltas.getCursoMasVotadoPorLicenciatura);

var EncuestasCtrl = require('../controllers/encuestasCtrl');
router.get('/encuestas', EncuestasCtrl.getEncuestas);

const EncuestasResCtrl = require('../controllers/encuestasResCtrl');
router.get('/encuestasRes/:periodo/:claveLic', EncuestasResCtrl.getEncuestasRes);

module.exports = router;

