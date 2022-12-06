const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
  nombre: {
    type: String
  },
  clave: {
    type: Number
  },
  tipo: {
    type: String,
    enum: ['Optativa', 'Obligatoria'],
    default: 'Obligatoria'
  }
});

module.exports = model('Curso', CursoSchema );