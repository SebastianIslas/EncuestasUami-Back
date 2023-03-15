const { query } = require("express");

const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso");

var controller = {
  getLicenciatura: function(req, res) {
    let claveLic = req.body.claveLic;
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
    let nombreLic = req.body.nombreLic
    let claveLic = req.body.claveLic
    let licenciatura = new Licenciatura({ nombre: nombreLic, clave: claveLic })

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
    let claveLic = req.body.claveLic;
    var query = {
      clave: claveLic
    };

    Licenciatura.findOne(query, { cursos: 1, _id: 0 }).populate({ path: 'cursos', select: '-_id' }).exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'No hay cursos que mostrar.' });
      }

      return res.status(200).send(result);
    });
  },


  postAgregarMateriaALicenciatura: function(req, res) {
    let claveLic = req.body.claveLic;
    let nombreUEA = req.body.nombre_UEA;
    let claveUEA = req.body.clave;
    var query = { clave: claveLic }
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


  postAgregarMateriaExistenteALicenciatura: function(req, res) {
    let claveLic = req.body.claveLic;
    let claveUEA = req.body.clave;
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


  // Remueve el curso asociado a una licenciatura ( de la lista de licenciaturas )
  removeCursoFromLicenciatura: function(req, res) {
    let claveLic = req.body.clave_lic;
    let claveCurso = req.body.clave_curso;
    let query = { clave: claveCurso }

    Curso.findOne(query).exec((err, curso) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });

      if (!curso) {
        return res.status(404).send({ message: 'No hay Planes de estudio que mostrar.' });
      }

      Licenciatura.updateOne(
        { clave: claveLic },
        { $pullAll: { cursos: [curso._id] }, }
      ).exec((err, plan) => {
        if (err) return res.status(404).send({ message: err });

        return res.status(200).send({
          message: "Se ha eliminado el curso correctamente"
        });
      });
    });
  },


  // Remueve completamente el curso
  deleteCurso: function(req, res) {
    let clave = req.body.clave_curso;

    Curso.findOneAndDelete({ clave: clave }).exec((err, curso) => {
      if (err) return res.status(404).send({ message: 'Ha ocurrido un error' });

      if (curso == null) return res.status(404).send({ message: "No se ha encontrado el curso" });

      return res.status(200).send({
        message: "Se ha eliminado el curso correctamente"
      });
    });
  },


  //Editar curso
  editarCurso: function(req, res) {
    let idCurso = req.params.idCurso;
    let newClave = req.body.clave;
    let newNombre = req.body.nombre;
    let newTipo = req.body.tipo;

    console.log(idCurso);

    Curso.updateOne(
      { clave: idCurso },
      {
        nombre: newNombre,
        clave: newClave,
        tipo: newTipo
      }
    ).exec((err, curs) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos o ya existe un curso con esta clave ! ' });

      if (curs.matchedCount == 0)
        return res.status(404).send({ message: "Curso a modificar no encontrada" });

      return res.status(200).send({ message: "El curso ha sido actualizado de manera correcta" });
    });
  }
};


module.exports = controller

