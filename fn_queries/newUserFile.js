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

const newUserFn = (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const name = req.body.name;
    const ap = req.body.ap;
    const am = req.body.am;
    const phone = req.body.phone;
    const birthDate = req.body.birthDate;
    const password = req.body.password;
    
    const queryStr = `
    with first_insert as (
        insert into cuenta(correo, contrasena) 
        values($1, $2) 
        RETURNING idcuenta
    ) 
        insert into usuario( nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idcuenta_fk, fechanac) 
        values
        ( $3, $4, $5, $6, $7, $8, $9, (select idcuenta from first_insert), $10)
        
    `;
    
    client.query(
        queryStr,
        [email, password, name, ap, am, username, '', phone, '', birthDate],
        (err, result) => {
        if (err) {
            console.log(err);
            res.send({ error: 'El correo ya está registrado' }); //funciona como return
            return;
        }
    console.log('From create account: ');
        console.log(result)
        res.send({ created: true})
        }
    );
}

module.exports = { newUserFn }

////////////////////////////////////////////////////////////////////////////////////////////