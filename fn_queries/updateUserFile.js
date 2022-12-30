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

const updateUserFn = (req, res) => {
    const [email, username, name, apellido1, apellido2, phone, blood] = [
      req.body.email,
      req.body.username,
      req.body.name,
      req.body.apellido1,
      req.body.apellido2,
      req.body.phone,
      req.body.tipodesangre
    ];
  
    client.query(
      `UPDATE Usuario
           SET nombre = $1, 
               ap = $2, 
               am = $3,
               apodo = $4,
               numerotelefonico = $5,
               tipodesangre = $6
  
          WHERE idcuenta_fk = ( SELECT idcuenta from Cuenta WHERE correo = $7 );`,
      [name, apellido1, apellido2, username, phone, blood, email],
      (err, result) => {
        if (err) {
          res.send({ error: err }); //funciona como return
        } else {
          console.log(result);
          res.send({ message: "Actualización exitosa." });
        }
      }
    );
  }

  module.exports = { updateUserFn }

////////////////////////////////////////////////////////////////////////////////////////////