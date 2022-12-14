const { Schema, model } = require('mongoose');
const PlanEstudios = require("./PlanEstudios");

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
},  {
  versionKey: false 
});

CursoSchema.post('findOneAndDelete',  function(doc) {
  console.log(doc)
  console.log('%s has been removed', doc._id);
  PlanEstudios.updateOne( { id: 0  }, {
    $pullAll: { cursos: [ doc._id ] },
  }).exec((err, res) => {
    console.log(err)
  }
  )
});

module.exports = model('Curso', CursoSchema );