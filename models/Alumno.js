const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema({
  id: {
    type: Number
  },
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
});

module.exports = model('Alumno', AlumnoSchema );