import Curso from './Curso';

const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
  version: {
    type: String
  },
  // Lista de cursos que pertenencen al plan de estudios
  cursos: [ Curso ]
});

module.exports = model('PlanEstudios', PlanEstudiosSchema );