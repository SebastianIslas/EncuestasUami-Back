const { Schema, model } = require('mongoose');

const RecuperacionPasswordSchema = Schema({
  matricula: {
    type: Number,
    unique: true,
    required: true
  },
  
  codigoRecuperacion: {
    type: String,
    unique: true,
    required: true
  },
},{
  versionKey: false 
});

module.exports = model('RecuperacionPassword', RecuperacionPasswordSchema );