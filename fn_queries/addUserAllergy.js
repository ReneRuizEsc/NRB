////////////////////////////////////////////////////////////////////////////////////////////

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

module.exports = { addUserAllergyFn }

////////////////////////////////////////////////////////////////////////////////////////////