const { Schema, model } = require('mongoose');

const AdministradorSchema = Schema({
  numEmpleado: {
    type: Number,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
});

module.exports = model('Administrador', AdministradorSchema);