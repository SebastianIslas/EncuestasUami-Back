const { query } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Administrador = require('../models/Administrador');
const RecuperacionPassword = require('../models/RecuperacionPassword');

const emailService = require("../helpers/send-email");

var controller = {
  loginAdmin: function(req, res) {
    const body = req.body;
    const email = body.email;

    console.log("body", body);

    Administrador.findOne({ email: email }).exec(function(err, admin) {
      // Verificar que exista admin con el correo
      if (!admin) {
        return res.status(404).send({ message: "Ocurrió un problema al iniciar sesión." });
      }

      console.log("Admin ", admin);

      let hashPassword = admin.get('password');
      const validPassword = bcrypt.compareSync(body.password, hashPassword);

      // Validamos que la password coincida
      if (!validPassword) {
        console.log("Contraseña incorrecta: ", email );
        return res.status(401).send({ message: "Ocurrió un problema al iniciar sesión." });
      }

      // Creacion del JWT
      const token = jwt.sign(
        { idUser: admin.numEmpleado, auth: "ADMIN" },
        process.env.SECRET_JWT_SEED,
        { expiresIn: 3600 }
      );

      // Enviamos una respuesta correcta con el token
      return res.status(200).send({ message: "Ha ingresado correctamente.", token });

    });
  },

  // Enviar un mensaje de recuperación de contraseña
  recuperarPasswordAdmin: function(req, res) {
    const numEmpleado = req.params.numEmpleado;

    // TODO: validar matrícula
    // TODO: borrar el registro en recuperacionPassword

    // Obtener el admin de la BD
    Administrador.findOne({ numEmpleado: numEmpleado }).exec(function(err, admin) {
      if (err) {
        res.status(400).send(err);
      };

      if (!admin) {
        return res.status(404).send({ message: "No se encontró el administrador con ese número" });
        // return res.status(200).send({ message: `Se mando un email a la dirección de correo del empleado ${numEmpleado}` });
      }

      console.log("Enviando correo de recuperación a: " + admin.email);

      // Generar un código de confirmación (son números y letras en mayúsculas)
      let codigoRecuperacion = crypto.randomBytes(3).toString('hex').toLocaleUpperCase('es-MX');

      // Agregamos el código en la entidad admin de la BD
      RecuperacionPassword.updateOne(
        { idUsuario: numEmpleado },
        {
          idUsuario: numEmpleado,
          codigoRecuperacion: codigoRecuperacion
        },
        { upsert: true }  // Si no encuentra un admin en la bd, lo crea
      ).exec(function(err, res) {
        if (res.acknowledged) {
          console.log("Creación de codigo de recuperación de admin con id: " + numEmpleado);
        } else {
          console.error("Creación de codigo de recuperación de admin con id: " + numEmpleado);
        }

        if (err) {
          console.error("Error al guardar datos para la recuperación: " + numEmpleado);
          res.status(400).send(err);
        }
      })

      // Enviar el correo
      try {
        emailService.sendEmailRecuperacionAlumno(admin.email, codigoRecuperacion);
        res.status(200).send(true);
      } catch (error) {
        console.error("Error con nodemailer al enviar correo a " + admin.email);
        res.status(400).send(error);
      }
    });
  },

  // Cambiar la password 
  reestablecerPasswordAdmin: function(req, res) {
    const numEmpleado = req.body.numEmpleado;
    const newPassword = req.body.password;
    const codigoRecuperacion = req.body.codigo.toLocaleUpperCase('es-MX');

    RecuperacionPassword.findOne(
      {
        idUsuario: numEmpleado,
        codigoRecuperacion: codigoRecuperacion
      }
    ).exec(function(err, datosRecuperacion) {
      if (datosRecuperacion) {
        if (err) {
          console.error("Error al obtener datos de recuperación de password: " + numEmpleado);
          res.status(400).send(err);
        }

        const salt = bcrypt.genSaltSync();
        let hashAndSaltPassword = bcrypt.hashSync(newPassword, salt);

        Administrador.updateOne(
          { numEmpleado: numEmpleado },
          { password: hashAndSaltPassword },
          { upsert: false }  // No crear un nuevo usuario, solo actualizar el correo
        ).exec(function(err, admin) {
          if (err) {
            console.error("Error al actualizar los datos de admin: " + numEmpleado);
            res.status(400).send(err);
          }

          if (admin) {
            console.log("Cambio de datos exitoso para admin: " + numEmpleado)
            res.status(200).send(true);
          }
        });
      }
    });
  }
};

module.exports = controller
