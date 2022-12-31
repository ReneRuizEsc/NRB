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

const updateAcompananteFile = (req, res) => {
    const usuario = req.body.idusuario;
    const nombre = req.body.nombre;
    const ap = req.body.ap;
    const am = req.body.am;
    const apodo = req.body.apodo;
    const fotoperfil = req.body.fotoperfil;
    const tipodesangre = req.body.tipodesangre;
    const numerotelefonico = req.body.numerotelefonico;
    
    const queryStr = `
    UPDATE acompanante
    SET nombre = $1,
        ap = $2,
        am = $3,
        apodo = $4,
        fotoperfil = $5,
        tipodesangre = $6,
        numerotelefonico = $7
    WHERE idusuario_fk = $8
        ;`
    
    client.query(
        queryStr,
        [nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, usuario],
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

module.exports = { updateAcompananteFile }

////////////////////////////////////////////////////////////////////////////////////////////