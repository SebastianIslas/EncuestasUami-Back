const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({

  matricula: {
    type: Number,
    unique: true
  },

  carrera: { 
    type: Schema.Types.ObjectId, 
    ref: 'Licenciatura' 
  }, // populate(clave) 
  
  email: {
    type: String,
    unique: true
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