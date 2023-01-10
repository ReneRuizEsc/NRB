////////////////////////////////////////////////////////////////////////////////////////////

//Verify userFunction and adminFuncion w showPending

////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const crypto = require("crypto");

function getFileExtension (name){
  try {
      let ext = name.match(/\.[^.]+$/gmi);

      return ext === null ? null : ext[0];
  } catch {
      return name;
  }
}

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
    const usuario = req.body.idusuario;
    
    const queryStr = `
            INSERT INTO verificacion (idUsuario_FK, FotoCredencialF, FotoCredencialT, FotoRostro, Verificacion, Pendiente)
            VALUES ($1, '', '', '', false, false)
        ;`
    
    client.query(
        queryStr,
        [usuario, fotoCredencialFrontal, fotoCredencialTrasera, fotoRostro],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fueron enviados los datos de verificacion' });
            return;
        }
            console.log('Solicitud registrada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

const uploadCredentialPic = (req, res, client) => {
    if(!req.session?.user || !req.session.user.idusuario)
        res.send("Hubo un problema");
  
    const file = req.files;
    const id = req.session.user.idusuario;
    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);

    let filepath = [];

    Object.entries(file).forEach(([key, value]) => {

        if(key == 'fotofredencialf')
        {
            filepath.push(`${__dirname}/../files/users/${id}/verify/credential-F-${randStr}${fileExt}`);
            value.mv(`${__dirname}/../files/users/${id}/verify/credential-F-${randStr}${fileExt}`, (err) => console.log(err))
        }
        if(key == 'fotocredencialt')
        {
            filepath.push(`${__dirname}/../files/users/${id}/verify/credential-T-${randStr}${fileExt}`);
            value.mv(`${__dirname}/../files/users/${id}/verify/credential-T-${randStr}${fileExt}`, (err) => console.log(err))
        }
        if(key == 'fotorostro')
        {
            filepath.push(`${__dirname}/../files/users/${id}/verify/fotoRostro-${randStr}${fileExt}`);
            value.mv(`${__dirname}/../files/users/${id}/verify/fotoRostro-${randStr}${fileExt}`, (err) => console.log(err))

        }
    })

    let query = 'UPDATE verificacion SET fotoCredencialF = $1, fotoCredencialT = $2, fotoRostro = $3, pendiente = true WHERE idusuario = $4;';
    client.query(query, [filepath[0], filepath[1], filepath[2], id],
        (err, result) => {
            if (err)
            {
            res.send({message: "Ha habido un problema. Intente más tarde."})
            }
            else
            {
            res.send({message: "Se ha subido la imagen con éxito."})
            }
        });
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Admin decides to verify a user.

const verifyAdminFn = (req, res, client) => {
    const usuario = req.body.usuario;
    
    const queryStr = `
        UPDATE verificacion 
        set verificacion = TRUE,
        pendiente = FALSE
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
    
    const queryStr = `
        DELETE from verificacion
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
            console.log('La solicitud de verificacion fue eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Use this to show a list of all pending requests

const showPendingVerificationFn = (req, res, client) => {
    const valor = true;
    
    const queryStr = `
    SELECT * from verificacion
    WHERE pendiente = $1;
        ;`
    
    client.query(
        queryStr,
        [valor],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Error al consultar' });
            return;
        }

        if (result.rows.length > 0) {
            res.send(result.rows[0]);
          } else {
            res.send({ message: "No existen pendientes" });
            console.log(result);
          }
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { verifyStatusFn, uploadCredentialPic, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn }

////////////////////////////////////////////////////////////////////////////////////////////