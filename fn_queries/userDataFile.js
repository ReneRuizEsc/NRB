////////////////////////////////////////////////////////////////////////////////////////////

//User Direction add, update, delete, show || Allergies add, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

// Insert into direccion_usuario

const addUserAddressFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const municipio = req.body.municipio;
    const colonia = req.body.colonia;
    const calle = req.body.calle;
    const numero = req.body.numero;
    
    const queryStr = `
        INSERT INTO direccion_usuario (idusuario_fk, pais, estado, municipio, colonia, calle, numero)
        values ($1, $2, $3, $4, $5, $6, $7)
        ;`
    
    client.query(
        queryStr,
        [usuario, pais, estado, municipio, colonia, calle, numero],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue añadida la direccion.' });
            return;
        }
            console.log('Direccion añadida.');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Update direccion info

const updateUserAddressFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const municipio = req.body.municipio;
    const colonia = req.body.colonia;
    const calle = req.body.calle;
    const numero = req.body.numero;
    
    const queryStr = `
        UPDATE direccion_usuario
        SET pais = $1,
        estado = $2,
        municipio = $3,
        colonia = $4,
        calle = $5,
        numero = $6
        WHERE idusuario_fk = $7
        ;`
    
    client.query(
        queryStr,
        [pais, estado, municipio, colonia, calle, numero, usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue actualizada la direccion.' });
            return;
        }
            console.log('Direccion actualizada.');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Delete direccion

const deleteUserAddressFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
        DELETE FROM direccion_usuario
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue eliminada la direccion' });
            return;
        }
            console.log('Direccion eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

// Insert into direccion_usuario

const showUserAddressFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
        SELECT * FROM direccion_usuario
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue realizada la consulta' });
            return;
        }
        if (result.rows.length > 0)
        {
            res.send(result.rows[0]);
        }
        else
        {
            res.send({ message: "No hay registro de direccion" });
            console.log(result);
        }
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Add user allergy

const addUserAllergyFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
        INSERT INTO u_alergia (idusuario_fk, alergia)
        values ($1, $2)
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue registrada la alergia' });
            return;
        }
            console.log('Alergia de usuario anadida');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Delete user allergy

const deleteUserAllergyFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
        DELETE FROM u_alergia
        WHERE idusuario_fk = $1 and alergia = $2
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue borrada la alergia' });
            return;
        }
            console.log('Alergia de usuario eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show all user allergies

const showUserAllergyFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
        SELECT * FROM u_alergia
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue registrada la alergia' });
            return;
        }
        console.log('Alergia de usuario anadida');
        console.log(result)
        res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { addUserAddressFn, updateUserAddressFn, deleteUserAddressFn, showUserAddressFn, addUserAllergyFn, deleteUserAllergyFn, showUserAllergyFn }

////////////////////////////////////////////////////////////////////////////////////////////