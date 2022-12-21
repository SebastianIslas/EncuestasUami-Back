const { Schema, model } = require('mongoose');
// importar el alumno, no usar la matricula

const EncuestaResueltaSchema = Schema({
  //Id el de mongo,

  alumno:{type: Schema.Types.ObjectId, ref: 'Alumno' },
  
  encuesta:{type: Schema.Types.ObjectId, ref: 'Encuesta' },
  
  cursosSeleccionados:
    [
      {
        //Cambiar la relacion en el modelo DDD
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