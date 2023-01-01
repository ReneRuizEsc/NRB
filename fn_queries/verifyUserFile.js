const Pool = require("pg").Pool;

let client = null;

const db = new Pool({
  user: "goldkkme",
  host: "peanut.db.elephantsql.com",
  database: "goldkkme",
  password: "FcXXaYxve6R_cjWWwod7xUv9FI-R99Cv",
  port: 5432,
});

try {
  db.connect(async (error, clnt, release) => {
    client = clnt;
  });
} catch (error) {
  console.log(error);
}

//////////////////////////////////////////////////////////////////////////////////////////// 
//El usuario no debe estar verificado previamente.
//Si no existe registro entonces está bien.

const verifyUserFn = (req, res) => {
    const usuario = req.body.idusuario;
    const fotoCredencialFrontal = req.body.fotofrontal;
    const fotoCredencialTrasera = req.body.fototrasera;
    const fotoRostro = req.body.fotorostro;
    const verificacion = false;
    
    const queryStr = `
    insert into verificacion (idUsuario_FK, FotoCredencialF, FotoCredencialT, FotoRostro, Verificacion)
    values ($1, $2, $3, $4, $5)
        ;`
    
    client.query(
        queryStr,
        [usuario, fotoCredencialFrontal, fotoCredencialTrasera, fotoRostro, verificacion],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Revisar este coso: Verificacion U' });
            return;
        }
        console.log('From register allergy: ');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { verifyUserFn }

////////////////////////////////////////////////////////////////////////////////////////////