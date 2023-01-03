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
    INSERT into direccion_usuario (idusuario_fk, pais, estado, municipio, colonia, calle, numero)
    values ($1, $2, $3, $4, $5, $6, $7)
        ;`
    
    client.query(
        queryStr,
        [usuario, pais, estado, municipio, colonia, calle, numero],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue añadida la direccion' });
            return;
        }
        console.log('Direccion añadida');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { addUserAddressFn }

////////////////////////////////////////////////////////////////////////////////////////////