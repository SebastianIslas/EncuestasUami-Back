const { Schema, model } = require('mongoose');

const EncuestaSchema = Schema({
  id: {
    type: Number
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'PlanEstudios'
  },
  maxMaterias: {
    type: Number
  },
  activo: {
    type: Boolean,
    default: False
  },
  encuestasResueltas: [ {
    type: Schema.Types.ObjectId,
    ref: 'EncuestaResuelta'
  } ]
});

module.exports = model('Encuesta', EncuestaSchema );
