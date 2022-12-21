/* 


// ELIMINAR DESPUES DE LA SESION CON EL PROFESOR


const { Schema, model } = require('mongoose');

const PlanEstudiosSchema = Schema({
  id: {
    type: Number
  },
  version: {
    type: String
  },
  cursos: [ {
    type: Schema.Types.ObjectId,
    ref: 'Curso'
  } ],

  encuestas: [ {
    type: Schema.Types.ObjectId,
   ref: 'Encuesta'
  } ]
  
}, {
  versionKey: false 
});

module.exports = model('PlanEstudios', PlanEstudiosSchema );

*/