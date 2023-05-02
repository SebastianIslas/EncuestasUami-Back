const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Alumno = require("../models/Alumno");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");
const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso")
const Profesor = require("../models/Profesor");


var controller = {
  getEncuestaRes: async function(req, res) {
    const matricula = req.body.matricula
    const periodo = req.body.periodo
    const claveLic = req.body.claveLic

    let idLic = (await Licenciatura.findOne({ clave: claveLic }))._id;
    var query = {
      periodo: periodo,
      licenciatura: idLic
    };
    let idEncuesta = (await Encuesta.findOne(query))._id;
    let idAlumno = (await Alumno.findOne({ matricula: matricula }))._id;
    EncuestaResuelta.findOne({ alumno: idAlumno, encuesta: idEncuesta }).exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'La encuesta no existe.' });
      }
      return res.status(200).send(result);
    });
  },

  //Get todas las encuestas resueltas por lic
  getEncuestasResEstadisticas: async function(req, res) {
    const periodo = req.params.periodo
    const claveLic = req.params.claveLic

    let idLic = (await Licenciatura.findOne({ clave: claveLic }))._id;

    let idEncuesta = (await Encuesta.findOne({periodo: periodo}))._id;

    //Encuestas de ese periodo y de esa licenciatura
    EncuestaResuelta
    .find({encuesta: idEncuesta})
    .populate({ path: 'alumno', match: { 'carrera': idLic }, select: 'carrera'})
    .populate({ path: 'cursosSeleccionados.curso', select: 'nombre clave' })
    .populate({ path: 'cursosSeleccionados.profesor', select: 'nombre claveEmpleado' })
    .exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'La encuesta no existe.' });
      }
      result = result.filter(encuesta => encuesta.alumno !== null); //Quitar encuestas que no sean de esa carrera

      const estadisticas = {};
      result.map((encuesta) => {
        encuesta.cursosSeleccionados.forEach((cursoSeleccionado) => {
          const cursoId = cursoSeleccionado.curso.clave;
          const cursoNombre = cursoSeleccionado.curso.nombre;
          const modalidad = cursoSeleccionado.modalidad;
          const turno = cursoSeleccionado.turno;
          const profesorId = cursoSeleccionado.profesor ? cursoSeleccionado.profesor.claveEmpleado : "SinOpc";
          const profesorNombre = cursoSeleccionado.profesor ? cursoSeleccionado.profesor.nombre : "";
      
          if (!estadisticas[cursoId]) {
            estadisticas[cursoId] = {
              nombre: cursoNombre,
              modalidades: {},
              turnos: {},
              profesores: {},
            };
          }
      
          const cursoStats = estadisticas[cursoId];
      
          if (!cursoStats.modalidades[modalidad]) {
            cursoStats.modalidades[modalidad] = 0;
          }
          cursoStats.modalidades[modalidad]++;
      
          if (!cursoStats.turnos[turno]) {
            cursoStats.turnos[turno] = 0;
          }
          cursoStats.turnos[turno]++;
      
          if (!cursoStats.profesores[profesorId]) {
            cursoStats.profesores[profesorId] = {
              votos: 0,
              nombre: profesorNombre
            }
          }
          cursoStats.profesores[profesorId].votos++;
        });
      });
      console.log(estadisticas)
      return res.status(200).send(estadisticas);
    });
  },


  agregarEncuestaResVacia: async function(req, res) {
    const matricula = req.body.matricula
    const periodo = req.body.periodo
    const claveLic = req.body.claveLic

    const idLic = (await Licenciatura.findOne({ clave: claveLic }))._id;
    const query = {
      periodo: periodo,
      licenciatura: idLic
    };
    const idEncuesta = (await Encuesta.findOne(query))._id;
    const idAlumno = (await Alumno.findOne({ matricula: matricula }))._id;
    const encuestaResuelta = new EncuestaResuelta({ alumno: idAlumno, encuesta: idEncuesta, cursosSeleccionados: [] })

    encuestaResuelta.save((err, encR) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !", errorContent: err });
      }
      if (encR == null) {
        return res.status(404).send({ message: "ERROR." });
      } else {
        Encuesta.findOne({ _id: idEncuesta }).exec((err, encuesta) => {
          if (err) return res.send(err);
          encuesta.encuestasResueltas.push(encR);
          encuesta.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "OK" });
          });
        });

      }
    });
  },


  recibirEncuestaResuelta: async function(req, res) {
    const matricula = req.params.matricula
    const claveLic = req.params.id_licenciatura
    const periodo = req.body.Encuestaperiodo
    var cursos = req.body.cursos
    let cursosClave = cursos.map(c => c.curso);
    const cursosId = (await Curso.find({ 'clave': { $in: cursosClave } }, { _id: 1 })).map(c => c._id)

    const idLic = (await Licenciatura.findOne({ clave: claveLic }))._id;
    const query = {
      periodo: periodo,
      licenciatura: idLic
    };
    const idEncuesta = (await Encuesta.findOne(query))._id;
    const idAlumno = (await Alumno.findOne({ matricula: matricula }))._id;
    for (i = 0; i < cursos.length; i++) {
      cursos[i].curso = cursosId[i]
    }

    const encuestaResuelta = new EncuestaResuelta({ alumno: idAlumno, encuesta: idEncuesta, cursosSeleccionados: cursos })


    encuestaResuelta.save((err, encR) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !", errorContent: err });
      }
      if (encR == null) {
        return res.status(404).send({ message: "ERROR." });
      } else {
        Encuesta.findOne({ _id: idEncuesta }).exec((err, encuesta) => {
          if (err) return res.send(err);
          encuesta.encuestasResueltas.push(encR);
          encuesta.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "OK" });
          });
        });

      }
    });
  },


  consultarUltimaEncuestaRes: async function(req, res) {
    const periodo = req.params.periodo;
    const matricula = req.params.matricula;
    const per = (await Encuesta.findOne({ periodo: periodo }));
    if (!per) {
      return res.status(404).send({ message: 'No existe periodo' });
    }
    const idEncuesta = (await Encuesta.findOne({ periodo: periodo }))._id;
    const alum = (await Alumno.findOne({ matricula: matricula }));
    if (!alum) {
      return res.status(404).send({ message: 'No existe alumno' });
    }
    const idAlumno = alum._id;
    const query = {
      alumno: idAlumno,
      encuesta: idEncuesta
    };
    EncuestaResuelta.findOne(query)
    .populate({ path: 'cursosSeleccionados.curso', select: 'nombre clave' })
    .populate({ path: 'cursosSeleccionados.profesor', select: 'nombre' })
    .exec((err, result) => {
      if (!result)
        return res.status(404).send({ message: ' ! El alumno no ha contestado la encuesta ! ' });
      if (err)
        return res.status(408).send({ message: ' ! El servidor no pudo responder la petición del usuario ! ' });
      return res.status(200).send(result);
    });
  },


  consultarEncuestasRes: async function(req, res) {
    const matricula = req.params.matricula;
    const alum = (await Alumno.findOne({ matricula: matricula }));
    if (!alum) {
      return res.status(404).send({ message: 'No existe alumno' });
    }
    const idAlumno = alum._id;
    const query = {
      alumno: idAlumno
    };
    EncuestaResuelta.find(query).populate({ path: 'cursosSeleccionados', select: 'curso' }).exec((err, result) => {
      if (!result)
        return res.status(404).send({ message: ' ! El alumno no tiene encuestas resueltas ! ' });
      if (err)
        return res.status(408).send({ message: ' ! El servidor no pudo responder la petición del usuario ! ' });
      return res.status(200).send(result);
    });
  },


  guardarEncuestaResuelta: async function(req, res) {
    let matricula = req.body.matricula;
    let periodo = req.body.encuesta;
    let cursos = req.body.cursosSeleccionados;
    console.log('Guardar', matricula, periodo, cursos);


    let cursosClave = cursos.map(c => c.curso);
    let cursosId = (await Curso.find({ 'clave': { $in: cursosClave } }, { _id: 1 })).map(c => c._id);
//    console.log('cursosClave, cursosId', cursosClave, cursosId);
    //Validar que todos los cursos seleccionados existan en la base de datos
    if (cursosId.length != cursosClave.length)
      return res.status(404).send({ message: "Algun curso seleccionado es invalido o esta duplicado" });
   

    let profesoresClave = cursos.map(c => c.profesor);
    let profesoresId = (await Profesor.find({ 'claveEmpleado': { $in: profesoresClave } }, { _id: 1, claveEmpleado: 1 }));

    profesoresId = profesoresClave.map(clave => profesoresId.find(id => id.claveEmpleado == clave));

    // Mapear los profesoresClave a los IDs correspondientes o una cadena vacía si no hay ID de prof a seleccionar (curso sin profes)
    const profesoresIdList = profesoresClave.map((clave, index) => {
   //   console.log("clave", clave, index);
      if (!clave) {
        return null;
      }
      const profesorId = profesoresId[index];
      return profesorId;
    });
//    console.log("profesoresIdList", profesoresIdList);
    //Validar que todos los profesores seleccionados existan en la base de datos
    if (profesoresIdList.length != profesoresClave.length)
      return res.status(404).send({ message: "Algun profesor seleccionado es invalido o esta duplicado" });


    let idEncuesta = (await Encuesta.findOne({ periodo: periodo }));
    if (!idEncuesta)
      return res.status(404).send({ message: "No se ha encontrado la encuesta" });
    console.log(idEncuesta.maxMaterias);
    if (cursosId.length > idEncuesta.maxMaterias)
      return res.status(404).send({ message: "Maximo de cursos permitidos superado " });


    let idAlumno = (await Alumno.findOne({ matricula: matricula }));
    if (!idAlumno)
      return res.status(404).send({ message: "No se ha encontrado el alumno" });


    for (i = 0; i < cursos.length; i++) {
      cursos[i].curso = cursosId[i]
      cursos[i].profesor = profesoresIdList[i]
    }
    console.log("cursosAEncRes: ", cursos);



    let encuestaResuelta = new EncuestaResuelta({ alumno: idAlumno._id, encuesta: idEncuesta._id, cursosSeleccionados: cursos })

    encuestaResuelta.save((err, encR) => {
      if (err) {
        return res.status(500).send({ message: "! Error en la base de datos !", errorContent: err });
      }
      if (encR == null) {
        return res.status(404).send({ message: "ERROR." });
      } else {
        Encuesta.findOne({ _id: idEncuesta }).exec((err, encuesta) => {
          if (err) return res.send(err);
          encuesta.encuestasResueltas.push(encR);
          encuesta.save(function(err) {
            if (err) return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
            return res.status(200).send({ message: "Encuesta resuelta guardada con exito" });
          });
        });

      }
    });
  }
};


module.exports = controller

