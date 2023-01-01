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

const addUserAddressFn = (req, res) => {
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
            res.send({ error: 'Ups' });
            return;
        }
        console.log('From verification: ');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { addUserAddressFn }

////////////////////////////////////////////////////////////////////////////////////////////