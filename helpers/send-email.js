// Enviar correos
const nodemailer = require("nodemailer");

require('dotenv').config();


// Un transporter es la entidad que puede enviar correos
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});


function sendEmailRecuperacionAlumno(destination, codigoRecuperacion) {
  var message = {
    from: process.env.SMTP_SENDER,
    to: destination,
    subject: "Código de recuperación de contraseña",
    text: `Hola, Alumno:\nTu código de recuperación es ${codigoRecuperacion}.`,
    html: `<p>Hola Alumno:</p><br><p>Tu código de recuperación es ${codigoRecuperacion}.</p>`
  };

  transporter.sendMail(message);
}

function sendEmailVerificacionAlumno(destination, matricula, token) {
  var message = {
    from: process.env.SMTP_SENDER,
    to: destination,
    subject: "Confirmacion de creacion de cuenta",
    text: `Hola, Alumno ${matricula}:\nAccede al siguiente link para cofirmar la creacion de tu cuenta para EncuestasUami http://${process.env.APP_URL}:4000/api/encuestas/v1/alumno/valida?token=${token}`,
    html: `<p>Hola, Alumno ${matricula}:</p><p>Da click para confirmar la creacion de tu cuenta para EncuestasUami <a href="http://${process.env.APP_URL}:4000/api/encuestas/v1/alumno/valida?token=${token}">Verificame!</a></p>`
  };

  transporter.sendMail(message);
}

function sendEmailNotificacionAlumno(destination, matricula) {
  var message = {
    from: process.env.SMTP_SENDER,
    to: destination,
    subject: "Notificacion de la creacion de tu cuenta en encuestas UAMI",
    text: `Hola, Alumno ${matricula}, gracias por crear una cuenta en encuestas UAMI`,
    html: `<p>Hola, Alumno ${matricula}, gracias por crear una cuenta en encuestas UAMI</p>`
  };

  transporter.sendMail(message);
}

module.exports = {
  sendEmailRecuperacionAlumno,
  sendEmailVerificacionAlumno,
  sendEmailNotificacionAlumno
}

