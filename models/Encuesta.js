import EncuestaResuelta from './EncuestaResuelta';

const { Schema, model } = require('mongoose');

const EncuestaSchema = Schema({
  id: {
    type: Number
  },
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
  encuestasResueltas: [ EncuestaResuelta ]
});

module.exports = model('Encuesta', EncuestaSchema );