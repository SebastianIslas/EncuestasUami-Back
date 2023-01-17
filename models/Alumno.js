const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({

  matricula: {
    type: Number,
    unique: true,
    required: true
  },

  carrera: { 
    type: Schema.Types.ObjectId, 
    ref: 'Licenciatura',
    required: true 
  }, 
  
  email: {
    type: String,
    unique: true,
    required: true
  },
  
  password: {
    type: String,
    required: true
  },
  
  EncuestasResueltas:
    [
      {
        type: Schema.Types.ObjectId,
        ref: 'EncuestaResuelta'
      }
    ]
},{
  versionKey: false 
});

module.exports = model('Alumno', AlumnoSchema );