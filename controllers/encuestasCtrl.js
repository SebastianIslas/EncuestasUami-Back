const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


const Licenciatura = require("../models/Licenciatura");
const Encuesta = require("../models/Encuesta");

var controller = {
            getEncuesta: async function (req, res) {
				const periodo = req.body.periodo
                const claveLic = req.body.claveLic

                idLic = (await Licenciatura.findOne({clave: claveLic}))._id;
				var query = {
					periodo: periodo,
                    licenciatura: idLic
				};
				Encuesta.findOne(query).populate({path:'licenciatura', select:'nombre'}).exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'La encuesta no existe.' });
					}
					return res.status(200).send(result);
				});
			},
			abrirEncuesta: function (req, res) {
				const periodo = req.body.periodo
				const maxMaterias  = req.body.maximo
                var query = {
					clave: req.body.claveLic 
				};
					
                Licenciatura.findOne(query).exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'No hay encuestas que mostrar.' });
					}
                    let encuesta = new Encuesta ({periodo: periodo, maxMaterias: maxMaterias, licenciatura: [result._id]})
                    encuesta.save((err, enc) =>{
                        if (err) {
                            return res.status(500).send({ message: "! Error en la base de datos !" , errorContent: err});
                        }
                        if (enc == null) {
                            return res.status(404).send({message: "No se ha podido abrir una nueva encuesta"});
                        } else {
                            return res.status(200).send({ message: "La encuesta se ha abierto de manera correcta" });
                        }
                    });
					
				});

				
				
			},
        

};

module.exports = controller