//////////////////////////////////////////////////////////////////////////////////////////// 

const updateUserFn = (req, res, client) => {
    const [email, username, name, apellido1, apellido2, phone, blood] = [
      req.body.email,
      req.body.username,
      req.body.name,
      req.body.apellido1,
      req.body.apellido2,
      req.body.phone,
      req.body.tipodesangre
    ];
  
    client.query(
      `UPDATE Usuario
           SET nombre = $1, 
               ap = $2, 
               am = $3,
               apodo = $4,
               numerotelefonico = $5,
               tipodesangre = $6
  
          WHERE idcuenta_fk = ( SELECT idcuenta from Cuenta WHERE correo = $7 )
          ;`,
      [name, apellido1, apellido2, username, phone, blood, email],
      (err, result) => {
        if (err) {
          res.send({ error: err }); //funciona como return
        } else {
          console.log(result);
          res.send({ message: "Actualización exitosa de datos." });
        }
      }
    );
  }

  module.exports = { updateUserFn }

//////////////////////////////////////////////////////////////////////////////////////////// 

// If idUsuario provides the correct password it can be changed.

const updateContrasenaFn = (req, res, client) => {
  const idusario =   req.body.idusuario;
  const contrasena = req.body.contrasenaActual;
  const contrasenaNueva = req.body.contrasenaNueva;

  client.query(
    `UPDATE cuenta
        SET contrasena = $1
        WHERE idcuenta = ( SELECT idCuenta_fk from usuario WHERE idusuario = $2 )
        and contrasena = $3
        ;`,
    [contrasena, idusario, contrasenaNueva],
    (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        console.log(result);
        res.send({ message: "Actualización exitosa de contrasena." });
      }
    }
  );
}

module.exports = { updateContrasenaFn }

////////////////////////////////////////////////////////////////////////////////////////////