const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Licenciatura = require("../models/Licenciatura");
const Alumno = require("../models/Alumno");
const EncuestaResuelta = require('../models/EncuestaResuelta');
const RecuperacionPassword = require("../models/RecuperacionPassword");

const emailService = require("../helpers/send-email");

var controller = {
  recuperarAlumno: function(req, res) {
    let matricula = req.params.matricula;
    var query = {
      matricula: matricula
    };
    Alumno.findOne(query).populate({ path: 'carrera', select: 'nombre clave -_id' }).exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'El alumno no existe.' });
      }
      return res.status(200).send(result);
    });
  },

  /**
   * Crea la cuenta para un alumno
   * @param {} req 
   * @param {*} res 
   */
  crearAlumno: function(req, res) {
    const matricula = req.body.matricula;
    const carrera = req.body.clave_lic;
    const email = req.body.email;
    const password = req.body.password;

    var query = {
      carrera//: req.body.claveLic 
    };

    Licenciatura.findOne(query).populate('cursos').exec((err, result) => {
      if (err)
        return res.status(500).send({ message: ' ! Error en la base de datos ! ' });
      if (!result) {
        return res.status(404).send({ message: 'La licenciatura no existe, no se pudo realizar el registro.' });
      }
      const salt = bcrypt.genSaltSync();
      const passwordEncrypt = bcrypt.hashSync(password, salt);
      let alumno = new Alumno({ matricula: matricula, carrera: result._id, email: email, password: passwordEncrypt });

      alumno.save((err, alm) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "! Error en la base de datos !", errorContent: err });
        }

        if (alm == null) {
          return res.status(404).send({ message: "No se ha podido agregrar el alumno." });
        } else {
          return res.status(201).send({ message: "El alumno ha sido creado de manera correcta" });
        }
      });
    });
  },

  // función que realiza el login para el Alumno
  logInAlumno: async function(req, res) {
    const body = req.body;
    const password = body.password;
    const alumno = await Alumno.findOne({ email: body.email });
    // verificamos que exista el alumno
    if (!alumno) {
      return res.status(404).send({ message: "No se ha podido encontrar al alumno." });
    }
    const hashPassword = await alumno.get('password');
    const validPassword = bcrypt.compareSync(password, hashPassword);
    // validamos que la password coincida
    if (!validPassword) {
      return res.status(401).send({ message: "Datos incorrectos." });
    }
    //creamos el token
    const token = jwt.sign({
      alumnoId: alumno.matricula
    }, process.env.SECRET_JWT_SEED, {
      expiresIn: 3600
    });
    // devolvemos el token con el mensaje 
    return res.status(200).send({ message: "Ha ingresado correctamente.", token });
  },

  obtenerEncuestAlumno: function(req, res) {
    const matricula = req.params.matricula;
    const id_licenciatura = req.params.id_licenciatura;
    Alumno.findOne({ matricula: matricula, carrera: id_licenciatura })
      .populate('EncuestasResueltas')
      .exec()
      .then(alumno => {
        if (!alumno) {
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

  obtenerEncuestAlumno: function(req, res) {
    const matricula = req.params.matricula;
    const id_licenciatura = req.params.id_licenciatura;

    Alumno.findOne({ matricula: matricula, carrera: id_licenciatura })
      .populate('EncuestasResueltas')
      .exec()
      .then(alumno => {
        if (!alumno) {
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
  recuperarPassword: function(req, res) {
    const matricula = req.params.matricula;

    // TODO: validar matrícula

    // Obtener el alumno de la BD
    let alumnoQuery = Alumno.findOne({ matricula: matricula }, 'email')

    alumnoQuery.exec(function(err, alumno) {
      if (err) {
        res.status(400).send(err)
      };

      if (!alumno) {
        res.status(400).send(err)
      }

      console.log("Enviando correo de recuperación a: " + alumno.email);

      // Generar un código de confirmación (son números y letras en mayúsculas)
      let codigoRecuperacion = crypto.randomBytes(3).toString('hex').toLocaleUpperCase('es-MX');

      // Agregamos el código en la entidad alumno de la BD
      RecuperacionPassword.updateOne(
        { idUsuario: matricula },
        {
          idUsuario: matricula,
          codigoRecuperacion: codigoRecuperacion
        },
        { upsert: true }  // Si no encuentra un alumno en la bd, lo crea
      ).exec(function(err, data) {
        if (err) {
          console.error("Error al guardar datos para la recuperación: " + matricula);
          res.status(400).send(err);
        }

        if (data.acknowledged) {
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
  },

  // Cambiar la password 
  reestablecerPassword: function(req, res) {
    const matricula = req.body.matricula;
    const newPassword = req.body.password;
    const codigoRecuperacion = req.body.codigo.toLocaleUpperCase('es-MX');

    RecuperacionPassword.findOne(
      {
        idUsuario: matricula,
        codigoRecuperacion: codigoRecuperacion
      }
    ).exec(function(err, datosRecuperacion) {
      if (err) {
        console.error("Error al obtener datos de recuperación de password: " + matricula);
        res.status(400).send(err);
      }

      if (!datosRecuperacion) {
        console.error("Error al obtener datos de recuperación de password: " + matricula);
        res.status(400).send(err);
      }

      const salt = bcrypt.genSaltSync();
      let hashAndSaltPassword = bcrypt.hashSync(newPassword, salt);

      Alumno.updateOne(
        { matricula: matricula },
        { password: hashAndSaltPassword },
        { upsert: false }
      ).exec(function(err, alumno) {
        if (err) {
          console.error("Error al actualizar los datos de: " + matricula);
          res.status(400).send(err);
        }

        if (alumno) {
          console.log("Cambio de datos exitoso para: " + matricula)
          res.status(200).send(true);
        }
      });
    });
  }
};

module.exports = controller
