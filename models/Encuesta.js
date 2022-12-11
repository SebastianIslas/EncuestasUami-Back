import EncuestaResuelta from './EncuestaResuelta';

const { Schema, model } = require('mongoose');

const EncuestaSchema = Schema({
  clavePlan: {
    type: String
  },
  maxMaterias: {
    type: Number
  },
  activo: {
    type: Boolean,
    default: False
  },
  // Array de los id de las encuestas relacionadas
  encuestasResueltas: [ Schema.Types.ObjectId ]
});

module.exports = model('Encuesta', EncuestaSchema );