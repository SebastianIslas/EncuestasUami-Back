const { Schema, model } = require('mongoose');


const AdministradorSchema = Schema({
  numEmpleado: {
    type: Number,
    unique: true,
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
}, { collection: 'administradores' });


module.exports = model('Administrador', AdministradorSchema);

