////////////////////////////////////////////////////////////////////////////////////////////

//Just the login

////////////////////////////////////////////////////////////////////////////////////////////

const loginFn = (req, res, client) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const queryStr = `
      SELECT correo, nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idusuario, fechanac, hasmembresia
      FROM usuario 
      INNER JOIN cuenta ON idcuenta = idcuenta_fk AND Correo = $1 AND Contrasena = $2
      ;
      `;
  
    client.query(
      queryStr,
      [email, password],
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
          console.log(result);
        }
      }
    );
}

module.exports = { loginFn }

////////////////////////////////////////////////////////////////////////////////////////////