const { Schema, model } = require('mongoose');

const EncuestaResueltaSchema = Schema({
  id: {
    type: Number
  },
  cursosSeleccionados:
    [
      {
        claveCurso: { 
          type: String
        },
        modalidad: { 
          type: String,
          enum: ['Presencial', 'Virtual', 'Mixta'],
          default: 'Presencial'
        },
        turno: { 
          type: String,
          enum: ['Mañana', 'Tarde', 'Noche'],
          default: 'Mañana'
        },
      }
    ]
});

module.exports = model('EncuestaResuelta', EncuestaResueltaSchema );