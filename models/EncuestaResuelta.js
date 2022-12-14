const { Schema, model } = require('mongoose');

const EncuestaResueltaSchema = Schema({
  id: {
    type: Number
  },
  matriculaAlumno: {
    type: Number
  },
  cursosSeleccionados:
    [
      {
        curso: { 
          type: Schema.Types.ObjectId,
          ref: 'Curso'
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
