const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
    nombre_UEA: {
        type: String
    },
    cupo : {
        type: Number
    },
    clave: {
        type: Number
    },
    turno: {
        type: String
    },
    modalidad: {
        type: String
    },
});

module.exports = model('PlanEstudios', PlanEstudiosSchema );