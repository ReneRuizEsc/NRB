////////////////////////////////////////////////////////////////////////////////////////////

//Just the login

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

module.exports = { loginFn }

////////////////////////////////////////////////////////////////////////////////////////////