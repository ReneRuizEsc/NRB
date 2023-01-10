////////////////////////////////////////////////////////////////////////////////////////////

//User and Password

////////////////////////////////////////////////////////////////////////////////////////////

//Use to register new users

const addUserFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';//pgp_sym_encrypt( $3, $7)
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
        values($1, pgp_sym_encrypt( $2, $12)) RETURNING idcuenta) 
        insert into usuario( nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idcuenta_fk, fechanac, hasmembresia) 
        values ( $3, pgp_sym_encrypt( $4, $12), pgp_sym_encrypt( $5, $12), $6, $7, pgp_sym_encrypt( $8, $12), pgp_sym_encrypt( $9, $12), (select idcuenta from first_insert), $10, $11)
        ;`
    
    client.query(
        queryStr,
        [email, password, name, ap, am, username, fotoperfil, phone, tiposangre, birthDate, membresia, key],
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
  const key = 'QxiE+JMOl7PTGP8rDIwhew==';
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
               ap = pgp_sym_encrypt( $2, $8), 
               am = pgp_sym_encrypt( $3, $8),
               apodo = $4,
               numerotelefonico = pgp_sym_encrypt( $5, $8),
               tipodesangre = pgp_sym_encrypt( $6, $8)
          WHERE idcuenta_fk = ( SELECT idcuenta from Cuenta WHERE correo = $7 )
          ;`,
      [name, apellido1, apellido2, username, phone, blood, email, key],
      (err, result) => {
        if (err)
        {
          res.send({ error: 'No fue actualizado el registro' });
        }
        else
        {
          req.session.user = {
            ...req.session.user,
            nombre: name,
            ap: apellido1,
            am: apellido2,
            apodo: username,
            numerotelefonico: phone,
            tipodesangre: blood
          }
          res.send({ message: "Actualización exitosa de datos." });
        }
      }
    );
  }

//////////////////////////////////////////////////////////////////////////////////////////// 

//Delete user with email and password (only normal user)

const deleteUserFn = (req, res, client) => {//EL MALDITO CASCADE DE LA MALDITA BASE DE DATOS NO FUNCIONA A PESAR DE QUE SE ENCUENTRA BIEN DECLARADO EN LAS MALDITAS RELACIONES
    const id = req.body.idusuario;
    const email = req.body.email;
    const password = req.body.password;
  
    const queryStr = `
        DELETE FROM direccion_usuario
        WHERE idusuario = $3;

        DELETE FROM verificacion
        WHERE idusuario = $3;

        DELETE FROM motocicleta
        WHERE idusuario = $3;

        DELETE FROM u_padecimientos
        WHERE idusuario = $3;

        DELETE FROM a_padecimientos
        WHERE idusuario = $3;

        DELETE FROM acompanante
        WHERE idusuario = $3;

        DELETE FROM puntos_evento
        WHERE idusuario = $3;

        DELETE FROM evento_Individual
        WHERE idusuario = $3;

        DELETE FROM usuario
        WHERE idusuario = $3;

        DELETE FROM cuenta
        WHERE email = $1 and password = $2
      ;`
  
    client.query(
      queryStr,
      [email, password, id],
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
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const idusario =   req.body.idusuario;
  
    client.query(`
        SELECT nombre, 
        pgp_sym_decrypt(ap::bytea, $2) as ap
        pgp_sym_decrypt(am::bytea, $2) as am
        apodo,
        pgp_sym_decrypt(numerotelefonico::bytea, $2) as numerotelefonico,
        pgp_sym_decrypt(tipodesangre::bytea, $2) as tipodesangre,
        idcuenta_fk, fechanac, hasmembresia FROM Usuario
        WHERE idusuario = $1
        ;`,
      [idusario, key],
      (err, result) => {
        if (err)
        {
          res.send({ error: err });
        }
        else
        {
          console.log(result);
          res.send({ message: "Mostrado cuenta" });
        }
      }
    );
  }
  
////////////////////////////////////////////////////////////////////////////////////////////

// If idUsuario provides the correct password it can be changed.

const updateContrasenaFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const idusario =   req.session.user.idusuario;
    const contrasena = req.body.contrasenaActual;
    const contrasenaNueva = req.body.contrasenaNueva;
  
    client.query(`
        UPDATE cuenta
        SET contrasena = pgp_sym_encrypt( $1, $4)
        WHERE idcuenta = ( SELECT idCuenta_fk from usuario WHERE idusuario = $2 )
        and pgp_sym_decrypt(contrasena::bytea, $4) = $3
        ;`,
      [contrasenaNueva, idusario, contrasena, key],
      (err, result) => {
        if (err)
        {
          res.send({ error: 'No se actualizó la contrasena' });
        }
        else
        {
          if(result.rowCount === 0){
            console.log("Contrasena incorrecta");
            return res.send({ message: "Contraseña incorrecta." });
          }else{
            console.log("Contrasena actualizada");
            return res.send({ message: "Actualización exitosa de contraseña." });

          }
        }
      }
    );
  }
  
  module.exports = { addUserFn, updateUserFn, deleteUserFn, showUserFn, updateContrasenaFn }
  
  ////////////////////////////////////////////////////////////////////////////////////////////