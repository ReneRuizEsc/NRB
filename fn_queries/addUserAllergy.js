//////////////////////////////////////////////////////////////////////////////////////////// 

const addUserAllergyFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
    insert into u_alergia (idusuario_fk, alergia)
    values ($1, $2)
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Ya está registrada esa alergia' });
            return;
        }
        console.log('From register allergy: ');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { addUserAllergyFn }

////////////////////////////////////////////////////////////////////////////////////////////