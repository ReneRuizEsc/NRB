////////////////////////////////////////////////////////////////////////////////////////////

//Just the login

////////////////////////////////////////////////////////////////////////////////////////////

const { response } = require('express');
var nodemailer = require('nodemailer');

////////////////////////////////////////////////////////////////////////////////////////////

const loginFn = (req, res, client) => {
    const email = req.body.email;
    const password = req.body.password;
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
  
    const queryStr = `
      SELECT correo, nombre, 
      pgp_sym_decrypt(ap::bytea, $3) as ap,
      pgp_sym_decrypt(am::bytea, $3) as am,
      apodo, fotoperfil, 
      pgp_sym_decrypt(numerotelefonico::bytea, $3) as numerotelefonico, 
      pgp_sym_decrypt(tipodesangre::bytea, $3) as tipodesangre,
      idusuario, fechanac, hasmembresia
      FROM usuario 
      INNER JOIN cuenta ON idcuenta = idcuenta_fk AND Correo = $1 AND Contrasena = $2
      ;
      `;
  
    client.query(
      queryStr,
      [email, password, key],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0) {
          req.session.user = result.rows[0];
          console.log("sesión creada");
          console.log(req.session.user);
          res.send(result.rows[0]);
        } else {
          res.send({ message: "Correo o contraseña incorrectos." });
          console.log("email: " + email);
        }
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

const restoreEmail = (req, res, client) => {
//const loginFn = (req, res, client) => {

const email = req.body.email;

const query = `
SELECT contrasena FROM cuenta
WHERE Correo = $1
;`



let userEmailResponse = client.query(query, [email], (err, result) =>
{
  if(err)
  {
    console.log("Error al ejecutar la consulta");
    console.log(err);
  }
  else
  {
    if(result)
    {
      userEmailResponse =  result.rows[0]; //{ contrasena: 'c' }
      console.log("In query; Contrasena del coso: " + userEmailResponse.contrasena);
      
    }
    else
    {
      console.log("No existe el correo");
      //res.send({ error: err });
    }
  }
});

//No sé que pasa que no quiere guardarse en el sitio que le corresponde
console.log("Contrasena del coso: "+ userEmailResponse.contrasena);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ttmotosescom@gmail.com',
    pass: 'aixmgdgdafdofbdc'
  }
});

var mailOptions = {
  from: 'ttmotosescom@gmail.com',
  to: 'muchfalsosuchwow@gmail.com',//email,
  subject: 'Recuperación de contraseña. NiceRider',
  text: 'La contrasena de la cuenta: '+ email +' regitrada es: '
};

transporter.sendMail(mailOptions, function(error, info)
{
  if (error)
  {
    console.log(error);
  } else
  {
    console.log('Email sent: ' + info.response);
  }
});

}

module.exports = { loginFn }

////////////////////////////////////////////////////////////////////////////////////////////