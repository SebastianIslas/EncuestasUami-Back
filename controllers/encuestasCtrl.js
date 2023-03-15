const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


const Licenciatura = require("../models/Licenciatura");
const Encuesta = require("../models/Encuesta");
const EncuestaResuelta = require("../models/EncuestaResuelta");

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
			crearEncuesta: function (req, res) {
				let periodo = req.body.periodo;
				console.log(req.params.sendStatus);
				let licenciaturas = req.body.licenciatura;
				let max_materias = req.body.max_materias;
				let activo = req.body.activo;
				console.log(licenciaturas);
				//**BUSCAR ID'S DE LICENCIATURAS RECIBIDAS */
				let idsLic;
				Licenciatura.find({ clave: { $in: licenciaturas } }, { _id: 1 }).exec((err, lics) => {
					idsLic = lics;
					if(lics.length == 0)
						return res.status(404).send({ message: "Licenciaturas no encontradas" });

					let encuesta = new Encuesta ({periodo: periodo, licenciatura: idsLic, maxMaterias: max_materias, activo: activo});
					encuesta.save((err, enc) =>{
						if (err) {
							return res.status(500).send({ message: "! Error en la base de datos !" });
						}
						if (enc == null) {
							return res.status(404).send({
								message: "No se ha podido crear la encuesta.",
							});
						} else if(req.params.sendStatus == undefined) {
							return res.status(200).send({ message: "La encuesta se ha creado de manera correcta" });
						}
					});
				});

				
			},
			//Elimina un documento de una encuesta
			eliminarEncuesta: function (req, res) {
				let periodo = req.params.idEncuesta;
				console.log(periodo);

				//Borrar todas las encuestas resueltas asosciadas a esta encuesta
				Encuesta.findOne({ periodo: periodo }, { encuestasResueltas: 1, _id: 0 }).exec((err, idsEncRes) => {
					if (err)
						return res.status(500).send({ message: "! Error en la base de datos !" });
					console.log(idsEncRes);
					//Hay encuestas resueltas para eliminar
					if(idsEncRes != null){
						EncuestaResuelta.deleteMany({ _id: { $in: idsEncRes.encuestasResueltas } }).exec((err, result) => {
							if (err)
								return res.status(500).send({ message: "! Error en la base de datos !" });
							if (result == null)
								return res.status(404).send({message: "No se han encontrado las encuestas resueltas"});
	
						});
					}
					//Elimina la encuesta despues de haber eliminado todos las encuestas resueltas asociadas a la misma.
					Encuesta.findOneAndDelete({ periodo: periodo }).exec((err, encuesta) =>{
						if (err) 
							return res.status(404).send({message: 'Ha ocurrido un error'});
						if (encuesta == null) 
							return res.status(404).send({message: "No se ha encontrado la encuesta a borrar"})
						if(req.params.sendStatus == undefined) 
							return res.status(200).send({message: "Se ha eliminado la encuesta correctamente"})

					});		

				});
			}, 

			editarEncuesta: function (req, res) {
				req.params.sendStatus = false;
				controller.eliminarEncuesta(req, res);
				controller.crearEncuesta(req, res);
				return res.status(200).send({message: "Se ha editado la encuesta correctamente"})
			}
 
/**
 * Eliminar encuesta borra toda la encuesta (con el arreglo de licenciaturas completo)
 * o solo quita la licenciatura del array de licenciaturas de esa encuesta 
 * 
 */


};

module.exports = controller