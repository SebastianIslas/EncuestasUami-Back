import Curso from './Curso';

const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
  id: {
    type: Number
  },
  version: {
    type: String
  },
  cursos: [ Curso ]
});

module.exports = model('PlanEstudios', PlanEstudiosSchema );