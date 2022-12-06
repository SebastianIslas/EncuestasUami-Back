import PlanEstudios from './PlanEstudios';

const { Schema, model } = require('mongoose');

const LicenciaturaSchema = Schema({
  nombre: {
    type: String
  },
  clave: {
    type: Number
  },
  planesEstudio: [ PlanEstudios ],
  encuestas: [ Encuesta ]
});

module.exports = model('Licenciatura', LicenciaturaSchema );