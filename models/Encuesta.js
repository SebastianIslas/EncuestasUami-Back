const { Schema, model } = require('mongoose');

const EncuestaSchema = Schema({
  periodo: {
    // 22O, 22I
    type: String
  },

  // Posiblemente sea bueno quitar esto
  licenciatura: [ {
    type: Schema.Types.ObjectId,
    ref: 'Licenciatura'
  } ],

  /* 
    // Solamente hay un plan de estudio por licenciatura!! 
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'PlanEstudios'
    },
  */

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
