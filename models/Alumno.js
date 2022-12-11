const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
  matricula: {
    type: Number
  },
  claveCarrera: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  // Array con el Id de las encuestas resueltas por este alumno
  encuestasResueltas: [ Schema.Types.ObjectId ]
});

module.exports = model('Alumno', AlumnoSchema );