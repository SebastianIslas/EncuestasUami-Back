const { Router } = require('express');
const router = Router();


const estadisticasEncustasResueltas = require('../controllers/estadisticas');


router.get('/estadisticas/cursoMasVotado/:periodo', estadisticasEncustasResueltas.getCursoMasVotado);
router.get('/estadisticas/cursoMasVotado/:periodo/:clavelicenciatura', estadisticasEncustasResueltas.getCursoMasVotadoPorLicenciatura);

module.exports = router;

