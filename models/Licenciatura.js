import PlanEstudios from './PlanEstudios';

const { Schema, model } = require('mongoose');

const LicenciaturaSchema = Schema({
  nombre: {
    type: String
  },
  clave: {
    type: Number
  },
  // Array de id de los planes de estudios
  planesEstudio: [ Schema.Types.ObjectId ],
  // Array de los id de las encuestas relacionadas
  encuestas: [ Schema.Types.ObjectId ]
});

module.exports = model('Licenciatura', LicenciaturaSchema );