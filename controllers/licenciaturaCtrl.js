// <3
const { query } = require("express");
		const req = require("express/lib/request");
		const res = require("express/lib/response");


		const Licenciatura = require("../models/Licenciatura");
		const Curso = require("../models/Curso");

		var controller = {

			/**
			 * [ HTTP | GET ]
			 * Funcion que obtiene todo un plan de estudios.
			 * 
			 * Parametros: 
			 * 	- claveLic
			 */
			getLicenciatura: function (req, res) {
				let claveLic = req.body.claveLic;
				var query = {
					clave: claveLic
				};
				Licenciatura.findOne(query).populate('cursos').exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'No hay Planes de estudio que mostrar.' });
					}
					return res.status(200).send(result);
				});
			},

			getCursos: function (req, res){
				let claveLic = req.body.claveLic;
				var query = {
					clave: claveLic
				};
				Licenciatura.findOne(query, {cursos: 1, _id: 0}).populate({path: 'cursos', select: '-_id'}).exec((err, result) => {
				if (err)
					return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
				if (!result) {
					return res.status(404).send({ message: 'No hay cursos que mostrar.' });
				}
				return res.status(200).send(result);
		});
	}
	,

	/**
	 * [ HTTP | POST ]
	 * Funcion que agrega una materia a un plan de estudios en particular
	 * 
	 * Parametros: 
	 * 	- clave_carrera      / solicitar revicion claveCarrera =! clave_carrera /
	 * 	- nombre_UEA
	 * 	- clave
	 *
	 */
	 
	postAgregarMateriaALicenciatura: function (req, res) {
		let claveLic = req.body.claveLic;
		let nombreUEA = req.body.nombre_UEA;
		let claveUEA = req.body.clave;
		var query = { clave: claveLic }
		let curso = new Curso ({nombre: nombreUEA,	clave: claveUEA})	

		curso.save((err, curso) =>{
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
						return res.status(200).send({ message: "El plan de estudios ha sido actualizado de manera correcta" });
					});
				});
			}
		});

	},

	/**
	 * [ HTTP | DELETE ]
	 * Funcion que elimina un curso de un plan de estudios en particular y de la coleccion de cursos
	 * 
	 * Parametros: 
	 *	- clave_plan
	 * 	- clave_curso
	 */

	
	 // Remueve el curso asociado a una licenciatura ( de la lista de licenciaturas )
	removeCursoFromLicenciatura: function (req, res) {
		let claveLic = req.body.clave_lic;
		let claveCurso = req.body.clave_curso;
                let query = {clave: claveCurso}
		Curso.findOne(query).exec((err, curso) => {
			if (err)
				return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
			if (!curso) {
				return res.status(404).send({ message: 'No hay Planes de estudio que mostrar.' });
			}
			Licenciatura.updateOne( { clave: claveLic }, {
				$pullAll: { cursos: [ curso._id ] },
			}).exec((err, plan) => {
					if(err) return res.status(404).send({message: err});
					return res.status(200).send({
						message: "Se ha eliminado el curso correctamente"
				})
			})
		});
		
	},
	// Remueve completamente el curso
	deleteCurso: function (req, res) {
		let clave = req.body.clave_curso;

		Curso.findOneAndDelete({ clave: clave }).exec((err,curso) =>{
			if (err) return res.status(404).send({message: 'Ha ocurrido un error'});
			if (curso == null) return res.status(404).send({message: "No se ha encontrado el curso"})
			return res.status(200).send({
				message: "Se ha eliminado el curso correctamente"
			})
		});
	},

};

module.exports = controller