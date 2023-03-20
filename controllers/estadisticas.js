const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Alumno = require("../models/Alumno");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");
const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso")


function mostCommonCurso(idCursos) {
  if (idCursos.length == 0)
    return null;

  var modeMap = {};
  var maxEl = idCursos[0],
    maxCount = 1;
  for (var i = 0; i < idCursos.length; i++) {
    var el = idCursos[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}


function ObtenerIdCursosdeLic(idCursos, idCursosLicenciatura) {
  var idCursoMasVotadosPorLic = {};
  console.log("cursosID:  ", idCursos[0]);
  console.log("cuesoLicID:", idCursosLicenciatura.cursos[0])

  for (var x = 0; x < idCursos.length; x++) {

    for (var y = 0; y < idCursosLicenciatura.cursos.length; y++) {
      console.log("cursosID:  ", idCursos[x]);
      console.log("cuesoLicID:", idCursosLicenciatura.cursos[y])
      if (idCursos[x] == idCursosLicenciatura.cursos[y]) {
        idCursoMasVotadosPorLic.push(idCursos[x]);
        break;
      }
    }
    console.log("Lista de Curso Liceasdasdas", idCursoMasVotadosPorLic);
    return idCursoMasVotadosPorLic;
  }
}


var controller = {
  getCursoMasVotado: async function(req, res) {
    const periodo = req.params.periodo;

    const ListaCursos = (await EncuestaResuelta.find({ periodo: periodo }, { "cursosSeleccionados.curso": 1 }));
    const idCursos = ListaCursos.map(e => { return e.cursosSeleccionados }).flat().map(e => e.curso).filter(e => { return e !== undefined })
    const idCursoMasVotado = mostCommonCurso(idCursos)
    const cursoMasVotadoPorLicenciatura = (await Curso.findOne({ "_id": idCursoMasVotado }, { "profesores": 0, "_id": 0 }))


    return res.status(200).send(cursoMasVotadoPorLicenciatura);
    //return res.status(200).send({ mensaje: " Estadistica mas Votada" })
  },


  getCursoMasVotadoPorLicenciatura: async function(req, res) {
    const periodo = req.params.periodo; //Obtener el Periodo
    const clavelicenciatura = req.params.clavelicenciatura; //Obtener la clave Licenciatura
    const CursosLicenciatura = (await Licenciatura.findOne({ clave: clavelicenciatura }, { "clave": false, "_id": false, "encuestas": false, "nombre": false })); //Obtener la Lista de los Curso de la Licenciatura

    //console.log(periodo);
    //console.log(clavelicenciatura);
    //console.log("Cursos Lic: ", CursosLicenciatura);

    const ListaCursos = (await EncuestaResuelta.find({ periodo }, { "cursosSeleccionados.curso": 1 }));
    const idCursos = ListaCursos.map(e => { return e.cursosSeleccionados }).flat().map(e => e.curso).filter(e => { return e !== undefined })

    const idCursoMasVotadosPorLic = ObtenerIdCursosdeLic(idCursos, CursosLicenciatura);
    const idCursoMasVotado = mostCommonCurso(idCursoMasVotadosPorLic);
    const cursoMasVotado = (await Curso.findOne({ "_id": idCursoMasVotado }, { "profesores": 0, "_id": 0 }))

    if (cursoMasVotado != null) {
      return res.status(200).send(cursoMasVotado);
    } else {
      return res.status(404).send({ mensaje: " No hay Votada para la licenciatura con clave " + clavelicenciatura })
    }
  }
}


module.exports = controller;

