////////////////////////////////////////////////////////////////////////////////////////////

//User and Password

////////////////////////////////////////////////////////////////////////////////////////////

//Use to register new users

const addUserFn = (req, res, client) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const ap = req.body.ap;
    const am = req.body.am;
    const username = req.body.username;
    const fotoperfil = req.body.fotoperfil;
    const phone = req.body.phone;
    const tiposangre = req.body.tipodesangre;
    const birthDate = req.body.birthDate;
    const membresia = false;
    
    const queryStr = `
      with first_insert as (insert into cuenta(correo, contrasena) 
        values($1, $2) RETURNING idcuenta) 
        insert into usuario( nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idcuenta_fk, fechanac, hasmembresia) 
        values ( $3, $4, $5, $6, $7, $8, $9, (select idcuenta from first_insert), $10, $11)
        ;`
    
    client.query(
        queryStr,
        [email, password, name, ap, am, username, fotoperfil, phone, tiposangre, birthDate, membresia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue realizado el registro' });
            return;
        }
          console.log('Se realizó el registro del perfil');
          console.log(result)
          res.send({ created: true})
        }
    );
}

//////////////////////////////////////////////////////////////////////////////////////////// 

//Use to change user info

const updateUserFn = (req, res, client) => {
      const email = req.body.email;
      const username = req.body.username;
      const name = req.body.name;
      const apellido1 = req.body.apellido1;
      const apellido2 = req.body.apellido2;
      const phone = req.body.phone;
      const blood = req.body.tipodesangre;
  
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
        if (err)
        {
          res.send({ error: 'No fue actualizado el registro' });
        }
        else
        {
          console.log(result);
          res.send({ message: "Actualización exitosa de datos." });
        }
      }
    );
  }

//////////////////////////////////////////////////////////////////////////////////////////// 

//Delete user with email and password

const deleteUserFn = (req, res, client) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const queryStr = `
        DELETE FROM cuenta
        WHERE email = $1 and password = $2
      ;`
  
    client.query(
      queryStr,
      [email, password],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'Registro no eliminado' });
        }
  
        console.log(result);
        res.send({ message: 'Registro eliminado' });
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show info from usuario

const showUserFn = (req, res, client) => {
    const idusario =   req.body.idusuario;
  
    client.query(`
        SELECT * FROM cuenta
        WHERE idusuario = $1
        ;`,
      [idusario],
      (err, result) => {
        if (err)
        {
          res.send({ error: err });
        }
        else
        {
          console.log(result);
          res.send({ message: "Actualización exitosa de contrasena." });
        }
      }
    );
  }
  
////////////////////////////////////////////////////////////////////////////////////////////

// If idUsuario provides the correct password it can be changed.

const updateContrasenaFn = (req, res, client) => {
    const idusario =   req.body.idusuario;
    const contrasena = req.body.contrasenaActual;
    const contrasenaNueva = req.body.contrasenaNueva;
  
    client.query(`
        UPDATE cuenta
        SET contrasena = $1
        WHERE idcuenta = ( SELECT idCuenta_fk from usuario WHERE idusuario = $2 )
        and contrasena = $3
        ;`,
      [contrasena, idusario, contrasenaNueva],
      (err, result) => {
        if (err)
        {
          res.send({ error: 'No se actualizó la contrasena' });
        }
        else
        {
          console.log(result);
          res.send({ message: "Actualización exitosa de contrasena." });
        }
      }
    );
  }
  
  module.exports = { addUserFn, updateUserFn, deleteUserFn, showUserFn, updateContrasenaFn }
  
  ////////////////////////////////////////////////////////////////////////////////////////////