const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


var PlanEstudios = require("../models/PlanEstudios");

var controller = {
    getPlanEstudios: function(req, res){
		PlanEstudios.find({}).exec((err, result) => {
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
};

module.exports = controller