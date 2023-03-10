const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Alumno = require("../models/Alumno");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");
const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso")



function mostCommonCurso(idCursos)
{
    if(idCursos.length == 0)
        return null;
    
    var modeMap = {};
    var maxEl = idCursos[0], maxCount = 1;
    for(var i = 0; i < idCursos.length; i++)
    {
        var el = idCursos[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}


var controller = {
    getCursoMasVotado: async function(req, res) {

        const periodo = req.params.periodo;
        const ListaCursos = (await EncuestaResuelta.find({}, { "cursosSeleccionados.curso":  1}));
        const idCursos = ListaCursos.map(e => { return e.cursosSeleccionados}).flat().map(e => e.curso).filter(e => { return e !== undefined } )
        const idCursoMasVotado = mostCommonCurso(idCursos)
        const cursoMasVotado = (await Curso.findOne({"_id": idCursoMasVotado}, {"profesores": 0,"_id": 0}))

        return res.status(200).send(cursoMasVotado);
    }

}

module.exports = controller;