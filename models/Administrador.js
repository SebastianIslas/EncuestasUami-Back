const { Schema, model } = require('mongoose');

const AdministradorSchema = Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
});

module.exports = model('Administrador', AdministradorSchema);