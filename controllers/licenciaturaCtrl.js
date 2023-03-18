const { query } = require("express");

const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso");
const Profesor = require("../models/Profesor");

var controller = {
  getLicenciatura: function(req, res) {
    let claveLic = req.params.id_lic;
    var query = {
      clave: claveLic
    };

    Licenciatura.findOne(query).populate('cursos').exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });

      if (!result) {
        return res.status(404).send({ message: 'No hay Licenciaturas que mostrar.' });
      }

      return res.status(200).send(result);
    });
  },


  agregarLicenciatura: function(req, res) {
    let nombreLic = req.body.nombreLic;
    let claveLic = req.body.claveLic;
    let licenciatura = new Licenciatura({ nombre: nombreLic, clave: claveLic });

    licenciatura.save((err, lic) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !", errorContent: err });
      }

      if (lic == null) {
        return res.status(404).send({ message: "No se ha podido agregrar la licenciatura." });
      } else {
        return res.status(200).send({ message: "La licenciatura ha sido creada de manera correcta" });
      }
    });
  },


  getCursos: function(req, res) {
    let claveLic = req.params.id_lic;
    var query = {
      clave: claveLic
    };

    Licenciatura.findOne(query, { cursos: 1, _id: 0 }).populate({ path: 'cursos', select: '-_id' }).exec((err, result) => {
      // XXX: luis-barrera, aquí hice cambios en los if, posibles errores
      if (err)
        return res.status(200).send(result);

      if (!result) {
        return res.status(404).send({ message: 'No hay cursos que mostrar.' });
      }

      return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
    });
  },


  editarLicenciatura: function(req, res) {
    let idLic = req.params.idLic;
    let newClave = req.body.clave;
    let newNombre = req.body.nombre;

    console.log(idLic);

    Licenciatura.updateOne(
      { clave: idLic },
      {
        nombre: newNombre,
        clave: newClave
      }
    ).exec((err, lic) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos o ya existe una licenciatura con esta clave ! ' });

      if (lic.matchedCount == 0)
        return res.status(404).send({ message: "Licenciatura a modificar no encontrada" });

      return res.status(200).send({ message: "La licenciatura ha sido actualizado de manera correcta" });
    });
  },


  eliminarLicenciatura: function(req, res) {
    let idLic = req.params.idLic;

    console.log(idLic);

    Licenciatura.findOneAndDelete({ clave: idLic }).exec((err, lic) => {
      if (err)
        return res.status(404).send({ message: 'Ha ocurrido un error' });

      if (lic == null)
        return res.status(404).send({ message: "No se ha encontrado la licenciatura" })

      return res.status(200).send({ message: "Se ha eliminado la licenciatura correctamente" })
    });
  },


  postAgregarMateriaALicenciatura: function(req, res) {
    let claveLic = req.params.id_lic;
    let nombreUEA = req.body.nombre_UEA;
    let claveUEA = req.body.clave;
    var query = { clave: claveLic };
    let curso = new Curso({ nombre: nombreUEA, clave: claveUEA });

    curso.save((err, curso) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !" });
      }

      if (curso == null) {
        return res.status(404).send({
          message: "No se ha podido agregar el curso.",
        });

      } else {
        Licenciatura.findOne(query).exec((err, plan) => {
          if (err) return res.send(err);
          plan.cursos.push(curso);
          plan.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "La licenciatura ha sido actualizado de manera correcta" });
          });
        });
      }
    });
  },


  crearCurso: function(req, res) {
    let nombreUEA = req.body.nombre_UEA;
    let claveUEA = req.body.clave;
    let curso = new Curso({ nombre: nombreUEA, clave: claveUEA })
    curso.save((err, curso) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !" });
      }
      if (curso == null) {
        return res.status(404).send({
          message: "No se ha podido agregar el curso.",
        });
      } else {
        return res.status(200).send({ message: "El curso se ha creado de manera correcta" });
      }
    });
  },


  agregarMateriaExistenteALicenciatura: function(req, res) {
    let claveLic = req.params.id_lic;
    let claveUEA = req.params.id_Materia;
    var query = { clave: claveLic }


    Curso.findOne({ clave: claveUEA }).exec((err, curso) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !" });
      }
      if (curso == null) {
        return res.status(404).send({
          message: "No se ha podido agregar el curso.",
        });
      } else {
        Licenciatura.findOne(query).exec((err, plan) => {
          if (err) return res.send(err);
          plan.cursos.push(curso);
          plan.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "La licenciatura ha sido actualizado de manera correcta" });
          });
        });
      }
    });
  },


  asignarProfesorAMateria: function(req, res) {
    let claveUEA = req.params.id_Materia;
    let claveProfe = req.params.claveEmpleado

    var query = { clave: claveUEA }


    Profesor.findOne({ claveEmpleado: claveProfe }).exec((err, prof) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !" });
      }
      if (prof == null) {
        return res.status(404).send({
          message: "No se ha podido agregar el profesor.",
        });
      } else {
        Curso.findOne(query).exec((err, c) => {
          if (err) return res.send(err);
          c.profesores.push(prof);
          c.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "El curso ha sido actualizado de manera correcta" });
          });
        });
      }
    });
  },


  getProfesoresFromCurso: function(req, res) {
    let claveUEA = req.params.id_materia;
    var query = {
      clave: claveUEA
    };

    Curso.findOne(query, { profesores: 1, _id: 0 }).populate({ path: 'profesores', select: '-_id' }).exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });

      if (!result) {
        return res.status(404).send({ message: 'No hay cursos que mostrar.' });
      }

      return res.status(200).send(result);
    });
  },


  // removeCursoFromLicenciatura
  removerProfesorFromCurso: function(req, res) {
    let claveCurso = req.params.id_materia;
    let claveProfe = req.params.claveEmpleado;
    let query = { claveEmpleado: claveProfe }

    Profesor.findOne(query).exec((err, profesor) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });

      if (!profesor) {
        return res.status(404).send({ message: 'No hay Cursos que mostrar.' });
      }

      Curso.updateOne({ clave: claveCurso }, {
        $pullAll: { profesores: [profesor._id] },
      }).exec((err, info) => {
        if (info.modifiedCount == 0) return res.status(404).send({ message: "El profesor no da ese curso" });

        if (err) return res.status(404).send({ message: err });

        return res.status(200).send({
          message: "Se ha eliminado el profesor correctamente"
        });
      });
    });
  },


  // Remueve el curso asociado a una licenciatura ( de la lista de licenciaturas )
  removeCursoFromLicenciatura: function(req, res) {
    let claveLic = req.body.clave_lic;
    let claveCurso = req.body.clave_curso;
    let query = { clave: claveCurso };

    Curso.findOne(query).exec((err, curso) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });

      if (!curso) {
        return res.status(404).send({ message: 'No hay Planes de estudio que mostrar.' });
      }

      Licenciatura.updateOne({ clave: claveLic }, {
        $pullAll: { cursos: [curso._id] },
      }).exec((err, plan) => {
        if (err) return res.status(404).send({ message: err });
        return res.status(200).send({
          message: "Se ha eliminado el curso correctamente"
        });
      });
    });
  },


  // Remueve completamente el curso
  eliminarCurso: function(req, res) {
    let clave = req.params.clave_curso;

    Curso.findOneAndDelete({ clave: clave }).exec((err, curso) => {
      if (err) return res.status(404).send({ message: 'Ha ocurrido un error' });

      if (curso == null) return res.status(404).send({ message: "No se ha encontrado el curso" })

      return res.status(200).send({
        message: "Se ha eliminado el curso correctamente"
      });
    });
  },
};


module.exports = controller

