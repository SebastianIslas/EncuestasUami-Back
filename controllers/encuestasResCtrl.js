const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Alumno = require("../models/Alumno");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");
const Licenciatura = require("../models/Licenciatura");
const Curso = require("../models/Curso")


var controller = {
            getEncuestaRes: async function (req, res) {
				const matricula = req.body.matricula
                const periodo   = req.body.periodo
                const claveLic  = req.body.claveLic
                
				let idLic = (await Licenciatura.findOne({clave: claveLic}))._id;
				var query = {
					periodo: periodo,
                    licenciatura: idLic
				};
                let idEncuesta = (await Encuesta.findOne(query))._id;
				let idAlumno = (await Alumno.findOne({matricula: matricula}))._id;
				EncuestaResuelta.findOne({alumno: idAlumno, encuesta: idEncuesta}).exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'La encuesta no existe.' });
					}
					return res.status(200).send(result);
				});
                
			},
			agregarEncuestaResVacia: async function (req, res) {
				const matricula = req.body.matricula
                const periodo   = req.body.periodo
                const claveLic  = req.body.claveLic
                
				const idLic = (await Licenciatura.findOne({clave: claveLic}))._id;
				const query = {
					periodo: periodo,
                    licenciatura: idLic
				};
                const idEncuesta = (await Encuesta.findOne(query))._id;
				const idAlumno = (await Alumno.findOne({matricula: matricula}))._id;
				const encuestaResuelta = new EncuestaResuelta ({alumno: idAlumno, encuesta: idEncuesta, cursosSeleccionados: []})	


				encuestaResuelta.save((err, encR) =>{
					if (err) {
						return res.status(500).send({ message: "! Error en la base de datos !" , errorContent: err});
					}
					if (encR == null) {
						return res.status(404).send({message: "ERROR."});
					} else {
						Encuesta.findOne({_id: idEncuesta}).exec((err, encuesta) => {
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
			recibirEncuestaResuelta: async function (req, res) {
				const matricula = req.params.matricula
				const claveLic  = req.params.id_licenciatura
                const periodo   = req.body.Encuestaperiodo
				var   cursos 	= req.body.cursos
				let   cursosClave = cursos.map(c => c.curso);
                const cursosId = (await Curso.find({'clave': { $in: cursosClave}},{ _id: 1})).map(c => c._id)

				const idLic = (await Licenciatura.findOne({clave: claveLic}))._id;
				const query = {
					periodo: periodo,
                    licenciatura: idLic
				};
                const idEncuesta = (await Encuesta.findOne(query))._id;
				const idAlumno = (await Alumno.findOne({matricula: matricula}))._id;
				for(i=0; i<cursos.length; i++){
					cursos[i].curso = cursosId[i]
				}
								
				const encuestaResuelta = new EncuestaResuelta ({alumno: idAlumno, encuesta: idEncuesta, cursosSeleccionados: cursos})	


				encuestaResuelta.save((err, encR) =>{
					if (err) {
						return res.status(500).send({ message: "! Error en la base de datos !" , errorContent: err});
					}
					if (encR == null) {
						return res.status(404).send({message: "ERROR."});
					} else {
						Encuesta.findOne({_id: idEncuesta}).exec((err, encuesta) => {
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
        
};

module.exports = controller