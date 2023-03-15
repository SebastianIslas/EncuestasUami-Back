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


module.exports = {
  sendEmailRecuperacionAlumno
}

