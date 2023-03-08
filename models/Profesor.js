const { Schema, model } = require('mongoose');


const ProfesorSchema = Schema({
  claveEmpleado: {
    type: Number,
    unique: true,
    required: true
  },

  nombre: {
    type: String,
    required: true
  },
}, {
  versionKey: false,
  collection: 'profesores'
});


module.exports = model('Profesor', ProfesorSchema);

