const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");

const Licenciatura = require("../models/Licenciatura");
const Alumno = require("../models/Alumno");
const EncuestaResuelta = require('../models/EncuestaResuelta');

const emailService = require("../helpers/send-email");

var controller = {
            recuperarAlumno: function (req, res) {
				let matricula = req.params.matricula;
				var query = {
					matricula: matricula
				};
				Alumno.findOne(query).populate({path:'carrera', select:'nombre clave -_id'}).exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'El alumno no existe.' });
					}
					return res.status(200).send(result);
				});
			},
			crearAlumno: function (req, res) {
				const matricula = req.body.matricula
				const email  = req.body.email
                const password = req.body.password
                var query = {
					clave: req.body.claveLic 
				};
					
                Licenciatura.findOne(query).populate('cursos').exec((err, result) => {
					if (err)
						return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
					if (!result) {
						return res.status(404).send({ message: 'La licenciatura no existe, no se ha podido agregar el alumno.' });
					}
                    let alumno = new Alumno ({matricula: matricula, carrera: result._id, email: email, password: password})
                    alumno.save((err, alm) =>{
                        if (err) {
                            return res.status(500).send({ message: "! Error en la base de datos !" , errorContent: err});
                        }
                        if (alm == null) {
                            return res.status(404).send({message: "No se ha podido agregrar el alumno."});
                        } else {
                            return res.status(200).send({ message: "El alumno ha sido creado de manera correcta" });
                        }
                    });
					
				});

				
				
			},
			obtenerEncuestAlumno: function (req, res)  {
				const matricula = req.params.matricula;
				const id_licenciatura = req.params.id_licenciatura;
				Alumno.findOne({matricula: matricula, carrera: id_licenciatura})
					.populate('EncuestasResueltas')
					.exec()
					.then(alumno => {
						if(!alumno) {
							return res.status(404).json({
								message: "Alumno no encontrado"
							});
						}
						res.status(200).send(alumno)
					})
					.catch(err => {
						res.status(500).json({
							error: err
						});
					});
			},

			// Enviar un mensaje de recuperación de contraseña
			recuperarPassword: function (req, res) {
				const matricula = req.params.matricula;	

				let emailData = new emailService.emailData(
					"tonyvaldovinos98@gmail.com",
					"Mensaje de prueba",
					false,
					null
				)

				try {
					emailService.sendEmail(emailData);
					res.status(200).send(true)
				} catch (error) {
					res.status(400).send(error)
				}
			}

};

module.exports = controller