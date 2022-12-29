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

const loginFn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const queryStr = `
      SELECT correo, nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idusuario, fechanac
      FROM usuario 
      INNER JOIN cuenta ON idcuenta = idcuenta_fk AND Correo = $1 AND Contrasena = $2;
      `;
  
    client.query(
      //"SELECT Correo FROM Cuenta_Usuario WHERE Correo = $1 AND Contrasena = $2"
      queryStr,
      [email, password],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err }); //funciona como return
          //return;
        }
  
        if (result.rows.length > 0) {
          // si el usuario existe,
          req.session.user = result.rows[0]; //crear una sesión para el usuario
          console.log("sesión creada");
          console.log(req.session.user);
          res.send(result.rows[0]);
        } else {
          res.send({ message: "Correo o contraseña incorrectos." });
          console.log(result);
        }
      }
    );
}

module.exports = {
    loginFn
}