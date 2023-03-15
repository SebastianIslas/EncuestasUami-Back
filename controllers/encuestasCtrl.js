const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


const Licenciatura = require("../models/Licenciatura");
const Encuesta = require("../models/Encuesta");

var controller = {
            recuperarEncuesta: function (req, res) {
				const periodo = req.params.periodo
                
				// En caso de necesitar una busqueda con la clave de la licencitura
				//const claveLic = req.body.claveLic
                //idLic = (await Licenciatura.findOne({clave: claveLic}))._id;
				/*var query = {
					periodo: periodo,
                    licenciatura: idLic
				};*/
				var query = {
					periodo: periodo
				}
				Encuesta.findOne(query).populate({path:'licenciatura', select:'nombre'}).exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'La encuesta no existe.' });
					}
					return res.status(200).send(result);
				});
			},
			iniciarEncuesta: function (req, res) {
				const periodo = req.body.periodo
				const maxMaterias  = req.body.max_materias
                var query = {
					clave: req.body.licenciatura 
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
			desactivarEncuesta: function (req, res) {
				const periodo = req.params.periodo;
				Encuesta.updateOne({ periodo: periodo }, { $set: { activo: false } })
					.exec()
					.then(result => {
						if(result.n === 0) {
							return res.status(404).json({
								message: "Encuesta no encontrada"
							});
						}
						res.status(200).json({
							message: "Encuesta desactivada con éxito"
						});
					})
					.catch(err => {
						res.status(500).json({
							error: err
						});
					});
			},

			consultarCursosEncuestaActivaLic : async function (req, res) {
				const claveLic  = req.params.claveLic;
				const licenciatura = await Licenciatura.findOne({clave: claveLic});
				if (!licenciatura) {
  					return res.status(404).send({ message: 'La licenciatura no se encontró en la base de datos.' });
				}
				const idLic = licenciatura._id;
				const encuesta = (await Encuesta.findOne({licenciatura: idLic, activo: true}));
				if (!encuesta) {
					return res.status(404).send({ message: 'La encuesta no se encuentra activa' });
				}
				const query = {
					_id : idLic
				};
				Licenciatura.findOne(query).populate({path:'cursos', select:'nombre'}).exec((err, result) => {
					if (err)
						return res.status(408).send({ message: ' ! El servidor no pudo responder la petición del usuario ! ' });
					return res.status(200).send(result);
				});
			},

			consultarEncuestaDesactivadaPeriodo : async function (req, res) {
				const periodo  = req.params.periodo;
				const encu = (await Encuesta.findOne({periodo: periodo}));
				if(!encu) {
					return res.status(404).send({ message: 'No existe periodo' });
				}
				const query = {
					periodo: periodo,
					activo: false
				};
				const noact = (await Encuesta.findOne(query));
				if(!noact){
					return res.status(404).send({ message: 'No existe encuesta desactivada en este periodo' });
				}
				Encuesta.findOne(query).populate({path:'licenciatura', select:'nombre'}).exec((err, result) => {
					if (err)
						return res.status(408).send({ message: ' ! El servidor no pudo responder la petición del usuario ! ' });
					return res.status(200).send(result);
				});
			},
        

};

module.exports = controller