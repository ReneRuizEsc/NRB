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

const verifyAdminFn = (req, res) => {
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