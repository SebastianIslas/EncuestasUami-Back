const { Schema, model } = require('mongoose');

const AdministradorSchema = Schema({
  id: {
    type: Number
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
});

module.exports = model('Administrador', AdministradorSchema);