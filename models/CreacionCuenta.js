const { Schema, model } = require('mongoose');


const CreacionCuentaSchema = Schema({
  matricula: {
    type: Number,
    unique: true,
    required: true
  },

  carrera: {
    type: Schema.Types.ObjectId,
    ref: 'Licenciatura',
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  token: {
    type: String,
    required: true
  }
}, {
  versionKey: false,
  collection: 'creacionCuentas'
});


module.exports = model('CreacionCuenta', CreacionCuentaSchema);