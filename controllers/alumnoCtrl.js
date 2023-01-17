const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");


const Licenciatura = require("../models/Licenciatura");
const Alumno = require("../models/Alumno");

var controller = {
            getAlumno: function (req, res) {
				let matricula = req.body.matricula;
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
			agregarAlumno: function (req, res) {
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
        

};

module.exports = controller