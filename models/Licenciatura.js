const { Schema, model } = require('mongoose');


const LicenciaturaSchema = Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },

  // ID que le da la UAM a la lic
  clave: {
    type: Number,
    required: true,
    unique: true
  },

  cursos: [{
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  }],

  encuestas: [{
    type: Schema.Types.ObjectId,
    ref: 'Encuesta'
  }]
}, {
  versionKey: false
});


module.exports = model('Licenciatura', LicenciaturaSchema);

