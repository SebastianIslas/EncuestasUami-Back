const { query } = require("express");

const Profesor = require("../models/Profesor");

var controller = {
  crearProfesor: function(req, res) {
    let clave = req.body.claveEmpleado;
    let nombreProfesor = req.body.nombreProfesor;
    let profesor = new Profesor({ claveEmpleado: clave, nombre: nombreProfesor });

    profesor.save((err, profesor) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !" });
      }

      if (profesor == null) {
        return res.status(404).send({
          message: "No se ha podido agregar al profesor.",
        });
      } else {
        return res.status(200).send({ message: "El profesor se ha creado de manera correcta" });
      }
    });
  },


  // Remueve completamente el profesor
  eliminarProfesor: function(req, res) {
    let clave = req.params.claveEmpleado;

    Profesor.findOneAndDelete({ claveEmpleado: clave }).exec((err, curso) => {
      if (err) return res.status(404).send({ message: 'Ha ocurrido un error' });

      if (curso == null) return res.status(404).send({ message: "No se ha encontrado el curso" });

      return res.status(200).send({
        message: "Se ha eliminado el profesor correctamente"
      });
    });
  },
  
  //Obtiene todos los profesores de la coleccion
  getProfesores: function(req, res) {
    Profesor.find().populate().exec((err, result) => {
      if (err)
      return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'No hay profesores que mostrar.' });
      }
      
      return res.status(200).send(result);
    });
  },
  //Editar profesor
  editarProfesor: function(req, res) {
    let idProfesor = req.params.idProfesor;
    let newClave = req.body.claveEmpleado;
    let newNombre = req.body.nombre;

    console.log(idProfesor, newClave, newNombre);

    Profesor.updateOne(
      { claveEmpleado: idProfesor },
      {
        nombre: newNombre,
        claveEmpleado: newClave
      }
    ).exec((err, curs) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos o ya existe un profesor con esta clave ! ' });

      if (curs.matchedCount == 0)
        return res.status(404).send({ message: "Profesor a modificar no encontrada" });

      return res.status(200).send({ message: "El profesor ha sido actualizado de manera correcta" });
    });
  }
};


module.exports = controller

