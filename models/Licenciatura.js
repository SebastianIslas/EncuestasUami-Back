const { Schema, model } = require('mongoose');

const LicenciaturaSchema = Schema({
  nombre: {
    type: String
  },
  clave: {
    type: Number
  },
  planesEstudio: [ {
    type: Schema.Types.ObjectId,
    ref: 'PlanEstudios'} 
  ],
  //encuestas: [ {
  //  type: Schema.Types.ObjectId,
  // ref: 'Encuesta'
  //} ]
});

module.exports = model('Licenciatura', LicenciaturaSchema );