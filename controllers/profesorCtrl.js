const { query } = require("express");
		const req = require("express/lib/request");
		const res = require("express/lib/response");


	const Profesor = require("../models/Profesor");

	var controller = {

	crearProfesor: function (req, res) {
	    let clave = req.body.claveEmpleado;
        let nombreProfesor = req.body.nombreProfesor;
	    let profesor = new Profesor ({ claveEmpleado: clave, nombre: nombreProfesor })
		profesor.save((err, profesor) =>{
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
	eliminarProfesor: function (req, res) {
		let clave = req.params.claveEmpleado;

		Profesor.findOneAndDelete({ claveEmpleado: clave }).exec((err,curso) =>{
			if (err) return res.status(404).send({message: 'Ha ocurrido un error'});
			if (curso == null) return res.status(404).send({message: "No se ha encontrado el curso"})
			return res.status(200).send({
				message: "Se ha eliminado el curso correctamente"
			})
		});
	},

};

module.exports = controller