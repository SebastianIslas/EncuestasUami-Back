const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    
    matricula: {
        type: String
    },
    password: {
        type: String
    },
    tipo_usuario: {
        type: String
    },
    carrera: {
        type: String
    },
    
});

module.exports = model('Usuario', UsuarioSchema );