////////////////////////////////////////////////////////////////////////////////////////////

//User Direction add, update, delete, show || Allergies add, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

// Insert into direccion_usuario

const addUserAddressFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const usuario = req.body.idusuario;
    const pais = req.body.pais;
    const estado = req.body.estado;
    const municipio = req.body.municipio;
    const colonia = req.body.colonia;
    const calle = req.body.calle;
    const numero = req.body.numero;
    
    const queryStr = `
        INSERT INTO direccion_usuario (idusuario_fk, pais, estado, municipio, colonia, calle, numero)
        values ($1, $2, $3, $4, pgp_sym_encrypt( $5, $8), pgp_sym_encrypt( $6, $8), pgp_sym_encrypt( $7, $8))
        ;`
    
    client.query(
        queryStr,
        [usuario, pais, estado, municipio, colonia, calle, numero, key],
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
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';//pgp_sym_encrypt( $3, $7)
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
        colonia = pgp_sym_encrypt( $4, $8),
        calle = pgp_sym_encrypt( $5, $8),
        numero = pgp_sym_encrypt( $6, $8)
        WHERE idusuario_fk = $7
        ;`
    
    client.query(
        queryStr,
        [pais, estado, municipio, colonia, calle, numero, usuario, key],
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
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';//pgp_sym_encrypt( $3, $7)
    const usuario = req.body.idusuario;
    
    const queryStr = `
        SELECT pais, estado, municipio,
        pgp_sym_decrypt(colonia::bytea, $2) as colonia
        pgp_sym_decrypt(calle::bytea, $2) as calle
        pgp_sym_decrypt(numero::bytea, $2) as numero
        FROM direccion_usuario
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario, key],
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

const addUserIllnessFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const padecimiento = req.body.padecimiento;
    const tipo = req.body.padecimiento; //1: Enfermedad, 2: Alergia
    
    const queryStr = `
        INSERT INTO u_padecimientos (idusuario_fk, padecimiento, tipo)
        VALUES ($1, $2, $3)
        ;`
    
    client.query(
        queryStr,
        [idusuario, padecimiento, tipo],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue registrada la enfermedad' });
            return;
        }
            console.log('Enfermedad de usuario anadida');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Delete user allergy

const deleteUserIllnessFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const padecimiento = req.body.padecimiento;
    
    const queryStr = `
        DELETE FROM u_padecimientos
        WHERE idusuario_fk = $1 and padecimiento = $2
        ;`
    
    client.query(
        queryStr,
        [idusuario, padecimiento],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue borrada la enfermedad' });
            return;
        }
            console.log('Enfermedad del usuario eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show all user illness

const showUserIllnessFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    
    const queryStr = `
        SELECT padecimiento FROM u_padecimientos
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [idusuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se encontraron enfermedades' });
            return;
        }
        if (result.rows.length > 0)
        {
            console.log('Lista de enfermedades');
            res.send(result.rows);
            }
        else
        {
            res.send({ message: "No hay registros de alergias de usuario" });
            console.log(result);
        }
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    addUserAddressFn,
    updateUserAddressFn,
    deleteUserAddressFn,
    showUserAddressFn,
    addUserIllnessFn,
    deleteUserIllnessFn,
    showUserIllnessFn
}

////////////////////////////////////////////////////////////////////////////////////////////