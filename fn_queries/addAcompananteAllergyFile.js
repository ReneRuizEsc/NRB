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

const addAcompananteAllergyFn = (req, res) => {
    const usuario = req.body.usuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
    INSERT into a_alergia (idusuario_fk, alergia)
    values ($1, $2)
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
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

module.exports = { addAcompananteAllergyFn }

////////////////////////////////////////////////////////////////////////////////////////////