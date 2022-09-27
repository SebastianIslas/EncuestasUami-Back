const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


var PlanEstudios = require("../models/PlanEstudios");

var controller = {

	/**
	 * [ HTTP | GET ]
	 * Funcion que obtiene todas las materias pertenecientes a un plan de estudios.
	 * 
	 * Parametros: 
	 * 	- claveCarrera
	 */
	getPlanEstudios: function (req, res) {
		let claveCarrera = req.body.claveCarrera;
		var query = {
			claveCarrera: claveCarrera
		};
		PlanEstudios.findOne(query).exec((err, result) => {
			if (err)
				return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
			if (!result) {
				return res.status(404).send({ message: 'No hay Planes de estudio que mostrar.' });
			}
			return res.status(200).send(result);
		});
	},

	/**
	 * [ HTTP | POST ]
	 * Funcion que agrega una materia a un plan de estudios en particular
	 * 
	 * Parametros: 
	 * 	- clave_carrera      / solicitar revicion claveCarrera =! clave_carrera /
	 * 	- nombre_UEA
	 * 	- claveUEA
	 *  
	 */
	postAgregarMateraAPlanEstudio: function (req, res) {
		let claveCarrera = req.body.clave_carrera;
		let nombreUEA = req.body.nombre_UEA;
		let claveUEA = req.body.clave;
		var query = { claveCarrera: claveCarrera }
		var update = {
			$push: {
				materias: {
					$each: [
						{
							nombre: nombreUEA,
							claveUEA: claveUEA,
						},
					],
				},
			},
		};

		PlanEstudios.updateOne(
			query,
			update,
			{ new: true },
			(err, plandDeEstudiosUpdated) => {
				if (err) {
					return res.status(500).send({ message: "! Error en la base de datos !" });
				}
				if (plandDeEstudiosUpdated == null) {
					return res.status(404).send({
						message: "No se encontro el plan de estudios a modificar.",
					});
				} else {
					return res.status(200).send({ message: "El plan de estudios ha sido actualizado de manera correcta" });
				}
			}
		);


	},

	/**
	 * [ HTTP | DELETE ]
	 * Funcion que elimina una materia de un plan de estudios en particular
	 * 
	 * Parametros: 
	 *	- clave_carrera      / solicitar revicion claveCarrera =! clave_carrera /
	 * 	- clave 
	 */

	deleteMateraPlanEstudio: function (req, res) {
		let claveCarrera = req.body.clave_carrera;
		let claveUEA = req.body.clave;
		var update = {
			$pull: {
				materias: {claveUEA: claveUEA},
			},
		};
		console.log({ update });
		let uea = PlanEstudios.find({ claveCarrera: claveCarrera });
		console.log({uea});

		if(uea){
			PlanEstudios.update(
                                {claveCarrera: claveCarrera}, 
                                update,
				(err, cuestionarioUpdated) => {
					if (err) {
						return res.status(500).send({ message: "! Error en la base de datos !" });
					}
					if (cuestionarioUpdated == null) {
						return res.status(404).send({
							message: "No existe la UEA a eliminar.",
						});
					} else {
						return res.status(200).send({message: "Se elimino la materia de la base de datos."});
					}
				}
			);
		}else{
			return res.status(404).send({
				message: "No existe el Plan de Estudios con esa clave.",
			});
		}

	},


};

module.exports = controller
