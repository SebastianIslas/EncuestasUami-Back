// Enviar correos
const nodemailer = require("nodemailer");

require('dotenv').config()

// Un transporter es la entidad que puede enviar correos
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})


// Objeto con los datos para enviar y el contenido del correo
// class emailData {
//   constructor(dest, subject, template, body) {
//     this.dest = dest;
//     this.subject = subject;
//     this.template = template; // Objeto de tipo template para renderizar el html del correo
//     this.body = body; // Objeto que contiene una serie de propiedades que usaremos renderizar el mensaje
//   }
// }

// TODO en lugar de una función general, tener una función por tipo de correo, para poder controlar la versión text y la html
function sendEmail(emailDataObject) {
  var message = {
    from: process.env.SMTP_SENDER,
    to: emailDataObject.dest,
    subject: emailDataObject.subject,
    // TODO: hacer un render para enviar el mensaje
    // text: 
    // html: emailDataObject.body
  };

  transporter.sendMail(message);
}

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


// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);

module.exports = {
  emailData,
  sendEmail,
  sendEmailRecuperacionAlumno
}