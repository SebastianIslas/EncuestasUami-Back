const { Schema, model } = require('mongoose');
const Licenciatura = require("./Licenciatura");


const CursoSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  clave: {
    type: Number,
    unique: true,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Optativa', 'Obligatoria'],
    default: 'Obligatoria'
  },

  profesores: [{
    type: Schema.Types.ObjectId,
    ref: 'Profesor'
  }]

}, {
  versionKey: false
});


CursoSchema.post('findOneAndDelete', function(doc) {
  console.log(doc)
  console.log('%s has been removed', doc._id);
  Licenciatura.updateOne({ id: 0 }, {
    $pullAll: { cursos: [doc._id] },
  }).exec((err, res) => {
    console.log(err)
  }
  )
});


module.exports = model('Curso', CursoSchema);

