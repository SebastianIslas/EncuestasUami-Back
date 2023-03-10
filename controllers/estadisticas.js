const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Alumno = require("../models/Alumno");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");
const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso")


var controller = {
    getCursoMasVotado: async function(req, res) {

        const periodo = req.params.periodo;
        const ListaCursos = (await Curso.find({}, { "clave": false, "tipo": false, "profesores": false }));
        const ListaEncuestaResuelta = (await EncuestaResuelta.find({}, {
            "alumno": false,
            "encuesta": false,
            "_id": false,
        }));



        const cursosIds = ListaEncuestaResuelta.map(c => c.cursosSeleccionados);
        console.log(cursosIds);
        console.log("El Primer curso es ", cursosIds[0][0].curso);

        //x[length(ListaCursos)]; //id,numero de materias
        //let i = 0;

        //for (let ElCurso in ListaCursListaEncuestaResuelta) {
        //const ListaX= (await ListaEncuestaResuelta.find({},{"modalidad":false},"turno":false,))

        //}


        //console.log("Entradno a Estadisticas");
        //console.log("El Periodo es:", periodo);
        //console.log("Las EncustasResuelatas Son: ", ListaEncuestaResuelta);
        //console.log("El id de los Cursos Son:", ListaCursos);

        return res.send({ message: "Mi Estadistica" });
    }

}

module.exports = controller;