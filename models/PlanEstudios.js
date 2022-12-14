const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
  id: {
    type: Number
  },
  version: {
    type: String
  },
  cursos: [ {
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  } ]
}, {
  versionKey: false 
});

module.exports = model('PlanEstudios', PlanEstudiosSchema );