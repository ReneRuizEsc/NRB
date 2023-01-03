//////////////////////////////////////////////////////////////////////////////////////////// 

/*const deleteAccountFn = (req, res, client) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const queryStr = `
      
      `;
  
    client.query(
      //"SELECT Correo FROM Cuenta_Usuario WHERE Correo = $1 AND Contrasena = $2"
      queryStr,
      [email, password],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err }); //funciona como return
          //return;
        }
  
        if (result.rows.length > 0) {
          // si el usuario existe,
          req.session.user = result.rows[0]; //crear una sesión para el usuario
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

module.exports = { deleteAccountFn }*/

////////////////////////////////////////////////////////////////////////////////////////////