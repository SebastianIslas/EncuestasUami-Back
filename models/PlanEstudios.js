const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
    claveCarrera:{
        type: Number
    },
    nombreCarrera:{
        type: String
    },
    materias: {
        type:Object
    }

});

module.exports = model('PlanEstudios', PlanEstudiosSchema );