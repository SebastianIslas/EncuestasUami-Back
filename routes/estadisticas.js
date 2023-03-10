const { Router } = require('express');
const router = Router();




const encuestasResCtrl = require('../controllers/estadisticas');

router.get('/estadisticas/cursoMasVotado',  encuestasResCtrl.getCursoMasVotado);

module.exports = router;