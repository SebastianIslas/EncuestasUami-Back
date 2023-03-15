const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWTAlumno = (req, res = response, next) => {
  // Obtener el token del header del request en el campo authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Falta proporcionar token',
      response: false
    });
  }

  jwt.verify(token, process.env.SECRET_JWT_SEED, (err, token_body) => {
    console.log(err);

    if (err) return res.sendStatus(403).json({
      message: 'El token no es correcto',
      response: false
    });

    console.log(token_body);
    req.token_body = token_body;
  });

  next();
}


module.exports = {
  validarJWTAlumno
}

