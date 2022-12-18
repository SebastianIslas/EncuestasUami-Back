const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
  matricula: {
    type: Number
  },
  // Relacionarlo con el plan porque son subversiones de la carrera
  // plan :{ Schema.Types.ObjectId, ref: 'PlanEstudios' },
  claveCarrera: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  
  EncuestasRess:
    [
      {
        eResuelta: { 
          type: Schema.Types.ObjectId,
          ref: 'EncuestaResuelta'
        }
      }
    ]
});

module.exports = model('Alumno', AlumnoSchema );