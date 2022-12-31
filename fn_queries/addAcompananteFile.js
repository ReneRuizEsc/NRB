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

const addAcompananteFn = (req, res) => {
    const usuario = req.body.idusuario;
    const nombre = req.body.nombre;
    const ap = req.body.ap;
    const am = req.body.am;
    const apodo = req.body.apodo;
    const fotoperfil = req.body.fotoperfil;
    const tiposangre = req.body.tipodesangre;
    const numerotelefonico = req.body.numerotelefonico;
    
    const queryStr = `
    INSERT into acompanate (idusuario_fk, nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico)
    values ($1, $2, $3, $4, $5, $6, $7, $8)
        ;`
    
    client.query(
        queryStr,
        [usuario, nombre, ap, am, apodo, fotoperfil, tiposangre, numerotelefonico],
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

module.exports = { addAcompananteFn }

////////////////////////////////////////////////////////////////////////////////////////////