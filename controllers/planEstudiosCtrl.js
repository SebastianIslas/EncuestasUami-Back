const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


var PlanEstudios = require("../models/PlanEstudios");

var controller = {
    getPlanEstudios: function(req, res){
		let claveCarrera = req.body.claveCarrera;
		console.log("clave carrera b", claveCarrera);
		var query = {
			claveCarrera:claveCarrera 
		  };
		console.log({query}); 
		PlanEstudios.findOne(query).exec((err, result) => {
			if(err)
				return res.status(500).send({message: 'Error con Mongo.'});

			if(!result){
                console.log({result});
				return res.status(404).send({message: 'No hay Planes de estudio que mostrar.'});
            }
            console.log(result);
            return res.status(200).send(result);
		});
	},

	postAgregarMateraAPlanEstudio: function(req,res){
		let claveCarrera = req.body.clave_carrera;
		let nombreUEA = req.body.nombre_UEA;
		let claveUEA = req.body.clave;
		var query = { claveCarrera: claveCarrera }
		var update = {
			$push: {
			  materias: {
				$each: [
				  {
					nombreUEA: nombreUEA,
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
			(err, cuestionarioUpdated) => {
			  if (err) {
				//console.log("errrrrreeer");
				return res.status(500).send({ message: "Error en Mongo." });
			  }
			  if (cuestionarioUpdated == null) {
				//console.log("NULLL");
				return res.status(404).send({
				  message: "No existe el Cuestionario. No se pudo actualizar.",
				});
			  } else {
				return res.status(200).send({ message : "Se actualizo"});
			  }
			}
		  );


	},
	deleteMateraPlanEstudio: function(req,res){
		let claveCarrera = req.body.clave_carrera;
		let claveUEA = req.body.clave;
		var query = { claveCarrera: claveCarrera }
		var update = {
			$pull: {
			  'materias.claveUEA':  claveUEA,

			},
		  };
		  console.log({update});
		  PlanEstudios.updateOne(
			
			update,
			
			(err, cuestionarioUpdated) => {
			  if (err) {
				//console.log("errrrrreeer");
				return res.status(500).send({ message: "Error en Mongo." });
			  }
			  if (cuestionarioUpdated == null) {
				//console.log("NULLL");
				return res.status(404).send({
				  message: "No existe el Cuestionario. No se pudo actualizar.",
				});
			  } else {
				return res.status(200).send(cuestionarioUpdated);
			  }
			}
		  );



	},








	
	

};

module.exports = controller