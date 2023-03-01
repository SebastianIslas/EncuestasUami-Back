const { Schema, model } = require('mongoose');

const EncuestaSchema = Schema({
  periodo: {
    // 22O, 22I
    type: String,
    unique : true,
    required: true
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
    type: Number,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  
  encuestasResueltas: [ {
    type: Schema.Types.ObjectId,
    ref: 'EncuestaResuelta'
  } ]
},{
  versionKey: false 
});

module.exports = model('Encuesta', EncuestaSchema );