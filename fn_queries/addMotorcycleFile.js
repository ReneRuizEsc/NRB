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

const addMotorcycleFn = (req, res) => {
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const placas = req.body.placas;
    const foto = req.body.foto;
    const tarjetaCirculacion = req.body.terjetaCirculacion;
    const idusuario = req.body.idusuario;
    
    const queryStr = `
    INSERT into motocicleta (marca, modelo, placas, foto, tarjetacirculacion, idusuario_fk)
    values ($1, $2, $3, $4, $5, $6)
        ;`
    
    client.query(
        queryStr,
        [marca, modelo, placas, foto, tarjetaCirculacion, idusuario],
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

module.exports = { addMotorcycleFn }

////////////////////////////////////////////////////////////////////////////////////////////