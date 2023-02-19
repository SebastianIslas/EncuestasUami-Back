const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const crypto = require("crypto");

const Licenciatura = require("../models/Licenciatura");
const Alumno = require("../models/Alumno");
const EncuestaResuelta = require('../models/EncuestaResuelta');
const RecuperacionPassword = require("../models/RecuperacionPassword");

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

		// TODO: validar matrícula

		// Obtener el alumno de la BD
		let alumnoQuery = Alumno.findOne({matricula: matricula}, 'email')

		alumnoQuery.exec(function (err, alumno) {
			if (err) {
				res.status(400).send(err)
 				return handleError(err);
			};
		
			console.log("Enviando correo de recuperación a: " + alumno.email);

			// Generar un código de confirmación (son números y letras en mayúsculas)
			let codigoRecuperacion = crypto.randomBytes(3).toString('hex').toLocaleUpperCase('es-MX');

			// Agregamos el código en la entidad alumno de la BD
			RecuperacionPassword.updateOne(
				{ matricula: matricula },
				{ 
					matricula: matricula,
					email: alumno.email,
					codigoRecuperacion: codigoRecuperacion
				},
				{ upsert: true }  // Si no encuentra un alumno en la bd, lo crea
			)
			.exec(function (err, res) {
				if (res.acknowledged) {
					console.log("Creación de codigo de recuperación de alumno con matrícula: " + matricula);
				} else {
					console.error("Creación de codigo de recuperación de alumno con matrícula: " + matricula);
				}
			})

			// Enviar el correo
			try {
				emailService.sendEmailRecuperacionAlumno(alumno.email, codigoRecuperacion);
				res.status(200).send(true)
			} catch (error) {
					console.error("Error con nodemailer al enviar correo a " + alumno.email);
				res.status(400).send(error)
			}
		})
	}

	// Cambiar la password 
};

module.exports = controller