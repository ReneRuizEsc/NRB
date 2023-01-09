////////////////////////////////////////////////////////////////////////////////////////////

//Verify userFunction and adminFuncion w showPending

////////////////////////////////////////////////////////////////////////////////////////////

//Use this to know status of account before everything

const verifyStatusFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
        SELECT verificacion from verificacion
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario, fotoCredencialFrontal, fotoCredencialTrasera, fotoRostro, verificacion],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó la consulta' });
            return;
        }
        if (result.rows.length > 0)
        {
            res.send(result.rows[0]); //Si el usuario está verificado
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

//User must not be registered nor be verified

const verifyUserFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const fotoCredencialFrontal = req.body.fotofrontal;
    const fotoCredencialTrasera = req.body.fototrasera;
    const fotoRostro = req.body.fotorostro;
    
    const queryStr = `
        insert into verificacion (idUsuario_FK, FotoCredencialF, FotoCredencialT, FotoRostro, Verificacion, Pendiente)
        values ($1, $2, $3, $4, false, false)
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

module.exports = { verifyStatusFn, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn }

////////////////////////////////////////////////////////////////////////////////////////////