////////////////////////////////////////////////////////////////////////////////////////////

//Verify userFunction and adminFuncion w showPending

////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const crypto = require("crypto");
const pathObj = require('path');
const { getFileExtension } = require("../generalFn/generalFn");
var nodemailer = require('nodemailer');
//Use this to know status of account before everything

const verifyStatusFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
        SELECT verificacion from verificacion
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó la consulta' });
            return;
        }
        if (result.rows.length > 0)
        {
            res.send(result.rows[0]);
        }
        else
        {
            res.send({ message: "No hay registro de verificacion del usuario" });
            console.log(result);
        }
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//User must not be registered nor be verified NO EXISTE

const verifyUserFn = (req, res, client) => {
    if(!req.session?.user || !req.session.user.idusuario)
        res.send("Hubo un problema");
  
    const file = req.files;
    const id = req.session.user.idusuario;
    const randStr = crypto.randomBytes(5).toString('hex');
    let fileExt;

    let filepath = {};

    Object.entries(file).forEach(([key, value]) => {
      fileExt = getFileExtension(value.name);

        if(key == 'fotocredencialf')
        {
            filepath.credF = `${__dirname}/../files/users/${id}/verify/credential-F-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/verify/credential-F-${randStr}${fileExt}`, (err) => console.log(err))
        }
        if(key == 'fotocredencialt')
        {

            filepath.credT = `${__dirname}/../files/users/${id}/verify/credential-T-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/verify/credential-T-${randStr}${fileExt}`, (err) => console.log(err))
        }
        if(key == 'fotorostro')
        {
            filepath.rostro = `${__dirname}/../files/users/${id}/verify/fotoRostro-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/verify/fotoRostro-${randStr}${fileExt}`, (err) => console.log(err))

        }
    })

    let query = 'UPDATE verificacion SET fotoCredencialF = $1, fotoCredencialT = $2, fotoRostro = $3, pendiente = true WHERE idusuario_fk = $4;';
    client.query(query, [filepath.credF, filepath.credT, filepath.rostro, id],
        (err, result) => {
            if (err)
            {
            res.send({message: "Ha habido un problema. Intente más tarde."})
            }
            else
            {
              req.session.user = {
                ...req.session.user,
                pendiente: true
              }
              res.send({message: "Se ha subido la imagen con éxito."});
            }
        });
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Admin decides to verify a user.

const verifyAdminFn = (req, res, client) => {
    const usuario = req.body.usuario;

    let userEmailResponse;

    const query =`
        WITH asd as (SELECT idCuenta_fk FROM usuario WHERE idusuario = $1)
        SELECT correo FROM cuenta where idCuenta = (SELECT idCuenta_fk FROM asd)
        ;`;

    client.query(query, [usuario], (err, result) => {
        if (err) {
            console.log("Error al ejecutar la consulta del correo");
            console.log(err);
          }
          else {
            if (result.rows.length > 0) {
              userEmailResponse = result.rows[0];
      
              let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ttmotosescom@gmail.com',
                  pass: 'aixmgdgdafdofbdc'
                }
              });
      
              let mailOptions = {
                from: 'ttmotosescom@gmail.com',
                to: userEmailResponse.correo,
                subject: 'Verificación de la cuenta - NiceRider',
                text: 'La solicitud de verificacion de la cuenta con correo: ' + userEmailResponse.correo + ' fue aprobada. \n ATTE: NiceRider'
              };
      
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
            else {
              console.log("No existe el correo");
            }
          }
        });
    
    const queryStr = `
        UPDATE verificacion 
        set verificacion = true,
        pendiente = false
        where idUsuario_fk = $1;
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se mandó la respuesta a la verificación' });
            return;
        }
            console.log('El usuario fue verificado');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Admin decides not to verify a user.

const notVerifyAdminFn = (req, res, client) => {
    const usuario = req.body.usuario;

    client.query(
        `SELECT fotoCredencialF, fotoCredencialT, fotoRostro FROM verificacion
        WHERE idusuario_fk = $1
        ;`,
        [usuario],
        (err, result) => {
            try {
              fs.unlinkSync(result.rows[0].fotoCredencialF);
              fs.unlinkSync(result.rows[1].fotoCredencialT);
              fs.unlinkSync(result.rows[2].fotoRostro);
              console.log("Old pictures deleted");
            } catch (error) {
              console.log(error);
            }
          })

    let userEmailResponse;

    const query =`
        WITH asd as (SELECT idCuenta_fk FROM usuario WHERE idusuario = $1)
        SELECT correo FROM cuenta where idCuenta = (SELECT idCuenta_fk FROM asd)
        ;`;

    client.query(query, [usuario], (err, result) => {
        if (err) {
            console.log("Error al ejecutar la consulta del correo");
            console.log(err);
          }
          else {
            if (result.rows.length > 0) {
              userEmailResponse = result.rows[0];
      
              let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ttmotosescom@gmail.com',
                  pass: 'aixmgdgdafdofbdc'
                }
              });
      
              let mailOptions = {
                from: 'ttmotosescom@gmail.com',
                to: userEmailResponse.correo,
                subject: 'Verificación de la cuenta - NiceRider',
                text: 'Lamentablemente la solicitud de verificacion de la cuenta con correo: ' + userEmailResponse.correo + ' fue rechazada. \n ATTE: NiceRider'
              };
      
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
            else {
              console.log("No existe el correo");
            }
          }
        });
    
    const queryStr = `
        UPDATE verificacion 
        set verificacion = false,
        pendiente = false,
        fotoCredencialF = '',
        fotoCredencialT = '',
        fotoRostro = ''
        where idUsuario_fk = $1;
        ;`;
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se mandó la respuesta a la verificación' });
            return;
        }
            console.log('La solicitud de verificacion fue eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Use this to show a list of all pending requests

const showPendingVerificationFn = (req, res, client) => {
    if(req.session.user.tipocuenta !== 2)
        return res.send("No es administrador");
    const valor = true;
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';

    const queryStr = `
      SELECT idusuario_fk, 
        nombre, 
        pgp_sym_decrypt(ap::bytea, $1) as ap,
        pgp_sym_decrypt(am::bytea, $1) as am  
      from verificacion
      INNER JOIN usuario
      ON idusuario_fk = idusuario AND pendiente = $2;
    ;`
    
    client.query(
        queryStr,
        [key, valor],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Error al consultar' });
            return;
        }

        if (result.rows.length > 0) {
            res.send(result.rows);
          } else {
            res.send({ message: "No existen pendientes" });
            console.log(result);
          }
        }
    );
}

const getCredencialF = (req, res, client) => {
    if(req.session.user.tipocuenta !== 2)
        return res.send("No es administrador");

    const idusuario = req.query.idusuario;
    const defaultPicturePath = `${__dirname}/../files/images/users/defaultProfilePic.webp`;
    const query = `
      SELECT fotocredencialf from verificacion WHERE idusuario_fk = $1;
    `;

    client.query(
      query, 
      [idusuario], 
      (err, result)=>{
          if(err)
            return res.sendFile(pathObj.resolve(defaultPicturePath));
          else{

            if(result.rows.length < 1 || result.rows[0].fotocredencialf.length < 2)
                return res.sendFile(pathObj.resolve(defaultPicturePath)); 
            else{
                const path = result.rows[0].fotocredencialf;
                console.log("Image path: ", path)
                return res.sendFile(pathObj.resolve(path), (err) => err && res.sendFile(pathObj.resolve(defaultPicturePath)));
            }
          }
      });
}

const getCredencialT = (req, res, client) => {
    if(req.session.user.tipocuenta !== 2)
        return res.send("No es administrador");

    const idusuario = req.query.idusuario;
    const defaultPicturePath = `${__dirname}/../files/images/users/defaultProfilePic.webp`;
    const query = `
      SELECT fotocredencialt from verificacion WHERE idusuario_fk = $1;
    `;

    client.query(
      query, 
      [idusuario], 
      (err, result)=>{
          if(err)
            return res.sendFile(pathObj.resolve(defaultPicturePath));
          else{

            if(result.rows.length < 1 || result.rows[0].fotocredencialt.length < 2)
                return res.sendFile(pathObj.resolve(defaultPicturePath)); 
            else{
                const path = result.rows[0].fotocredencialt;
                console.log("Image path: ", path)
                return res.sendFile(pathObj.resolve(path), (err) => err && res.sendFile(pathObj.resolve(defaultPicturePath)));
            }
          }
      });
}

const getFotoRostro = (req, res, client) => {
    if(req.session.user.tipocuenta !== 2)
        return res.send("No es administrador");

    const idusuario = req.query.idusuario;
    const defaultPicturePath = `${__dirname}/../files/images/users/defaultProfilePic.webp`;
    const query = `
      SELECT fotorostro from verificacion WHERE idusuario_fk = $1;
    `;

    client.query(
      query, 
      [idusuario], 
      (err, result)=>{
          if(err)
            return res.sendFile(pathObj.resolve(defaultPicturePath));
          else{

            if(result.rows.length < 1 || result.rows[0].fotorostro.length < 2)
                return res.sendFile(pathObj.resolve(defaultPicturePath)); 
            else{
                const path = result.rows[0].fotorostro;
                console.log("Image path: ", path)
                return res.sendFile(pathObj.resolve(path), (err) => err && res.sendFile(pathObj.resolve(defaultPicturePath)));
            }
          }
      });
}

const allUsers = (req, res, client) => {

  const key = 'QxiE+JMOl7PTGP8rDIwhew==';

  const queryStr = `
      SELECT apodo, correo, nombre, 
      pgp_sym_decrypt(numerotelefonico::bytea, $1) as numerotelefonico, 
      hasmembresia,
      tipocuenta,
      verificacion,
      pendiente
      FROM usuario 
      INNER JOIN cuenta ON idcuenta = idcuenta_fk
      INNER JOIN verificacion ON idusuario_fk = idusuario
      ;
      `;

  client.query(
    queryStr,
    [key],
    (err, result) => {
      if (err)
      {
        console.log(err);
        return res.send({ error: err });
      }

      if (result.rows.length > 0)
      {
        return res.send(result.rows);
      } else
      {
        res.send({ message: "No hay registros" });
        return console.log("email: " + email);
      }
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { verifyStatusFn, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn, getCredencialF, getCredencialT, getFotoRostro, allUsers }

////////////////////////////////////////////////////////////////////////////////////////////