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

const restorePassword = (req, res, client) => {
  //const loginFn = (req, res, client) => {

  const email = req.body.email;

  const query = `
    SELECT contrasena FROM cuenta
    WHERE Correo = $1
  ;`

  let userEmailResponse;

  client.query(query, [email], (err, result) => {
    if (err) {
      console.log("Error al ejecutar la consulta");
      console.log(err);
    }
    else {
      if (result.rows > 0) {
        userEmailResponse = result.rows[0]; //{ contrasena: 'c' }
        console.log("In query; Contrasena del coso: " + userEmailResponse.contrasena);

        //No sé que pasa que no quiere guardarse en el sitio que le corresponde
        console.log("Contrasena del coso: " + userEmailResponse.contrasena);

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ttmotosescom@gmail.com',
            pass: 'aixmgdgdafdofbdc'
          }
        });

        let mailOptions = {
          from: 'ttmotosescom@gmail.com',
          to: email,//email,
          subject: 'Recuperación de contraseña. NiceRider',
          text: 'La contrasena de la cuenta: ' + email + ' regitrada es: ' + userEmailResponse.contrasena
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.send({message: "ok"});
      }
      else {
        console.log("No existe el correo");
        res.send({error: "no existe el correo"});
        //res.send({ error: err });
      }
    }
  });

}

module.exports = { loginFn, restorePassword }

////////////////////////////////////////////////////////////////////////////////////////////