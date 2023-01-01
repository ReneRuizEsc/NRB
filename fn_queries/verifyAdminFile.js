//////////////////////////////////////////////////////////////////////////////////////////// 

const verifyAdminFn = (req, res, client) => {
    const usuario = req.body.usuario;
    
    const queryStr = `
    UPDATE
    Verificacion 
    set verificacion = TRUE
    where idUsuario_fk = $1;
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Ups' });
            return;
        }
        console.log('From verification: ');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { verifyAdminFn }

////////////////////////////////////////////////////////////////////////////////////////////