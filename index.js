const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const Pool = require("pg").Pool;

require("dotenv").config();

// Para las sesiones //
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const session = require("express-session");
///////////////////////
const oneDay = 1000 * 60 * 60 * 24;
const frontendURL = process.env.FRONTEND;
const PORT = process.env.LISTEN_PORT;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [frontendURL, 'http://192.168.0.57:3000'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "alicia la loca",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: oneDay,
      //sameSite: 'strict',

      secure: "auto",
      httpOnly: true,
      sameSite: 'none',
    },
  })
);

// Conexión con la base de datos //
/*
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "pikachu09",
    database: "nicerider"
});*/
let client = null;

// const db = new Pool({
//   user: "postgres",
//   host: "127.0.0.1",
//   database: "nicerider",
//   password: "pikachu99",
//   port: 5432,
// });
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
///////////////////////////////////

app.get("/checkLogin", (req, res) => {
  // Este get sirve para verificar si hay una sesión guardada
  if (req.session.user) {
    res.send({ isLogged: true, user: req.session.user });
  } else {
    res.send({ isLogged: false });
  }
});

app.get("/userinfo", (req, res) => {
  const email = [req.query.email];
  const queryStr = `
  SELECT Nombre, AP, AM, Telefono, Apodo, Fechanac, verificacion, kmtotales, velocidadpromedio, fotoperfil, tiempoviaje, identificacion, idUsuario
  FROM Persona 
  INNER JOIN Cuenta_Usuario ON idPersona = idUsuario AND Correo = $1 
  INNER JOIN informacion_cuenta ON idusuario = idinformacion_cuenta;
  `
  client.query(
    queryStr,
    [String(email)],
    (err, result) => {
      if (err) {
        console.log("error en la consulta");
        console.log(err.stack);
      } else {
        console.log(result);
        res.send({ userdata: result.rows[0] });
      }
    }
  );
});

app.get("/friendsList", (req, res) => {
  const email = [req.query.email];
  // const queryStr = `
  // SELECT Nombre, AP, AM, Apodo, verificacion, fotoperfil
  // FROM Persona 
  // INNER JOIN Cuenta_Usuario ON idPersona = idUsuario AND Correo = $1 
  // INNER JOIN informacion_cuenta ON idusuario = idinformacion_cuenta;
  // `
  const queryStr = `
    SELECT amigos
    FROM Cuenta_Usuario
    WHERE correo = $1;
  `
  client.query(
    queryStr,
    [String(email)],
    (err, result) => {
      if (err) {
        //console.log("error en la consulta");
        console.log(err.stack);
      } else {
        console.log(result);
        let vals = Object.values(result.rows[0])[0];
        vals = JSON.parse(vals)
        
        if(vals === null)
          res.send([])
        else{
          let newQuery = `
            SELECT Nombre, AP, AM, Apodo, verificacion, fotoperfil, idUsuario
            FROM Persona
            INNER JOIN Cuenta_Usuario ON idPersona = idUsuario AND (idUsuario = $1
          `
          if(vals.length > 1){
            for(let i=1; i<vals.length; i++){
              newQuery += ' OR idUsuario = $' + (parseInt(i)+1);
            }
          }

          newQuery += ') INNER JOIN informacion_cuenta ON idusuario = idinformacion_cuenta;';
         
          client.query(
              newQuery,
              vals,
              (error, result2) => {
                if(err)
                  console.log(error.stack)
                else{
                  //console.log(result2.rows)
                  res.send(result2.rows)
                }
              }
          );
          
        }
      
      }
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const queryStr = `
  //   SELECT Correo, Nombre, AP, AM, Telefono, Apodo, Fechanac, verificacion, amigos, kmtotales, velocidadpromedio, fotoperfil, tiempoviaje, identificacion, idUsuario
  //   FROM Persona 
  //   INNER JOIN Cuenta_Usuario ON idPersona = idUsuario AND Correo = $1 AND Contrasena = $2
  //   INNER JOIN informacion_cuenta ON idusuario = idinformacion_cuenta;
  //   `;

  const queryStr = `
    SELECT correo, nombre, ap, am, apodo, fotoperfil, numerotelefonico, tipodesangre, idcuenta_fk, fechanac
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
});

app.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  } else {
    res.send({ isLogged: false });
  }
});

app.post("/createAccount", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const name = req.body.name;
  const ap = req.body.ap;
  const am = req.body.am;
  const phone = req.body.phone;
  const birthDate = req.body.birthDate;
  const password = req.body.password;

  // const queryStr = `
  // with first_insert as (
  //   insert into persona(nombre, ap, am, fechanac) 
  //   values($1, $2, $3, $4) 
  //   RETURNING idPersona
  // ), 
  // second_insert as (
  //  insert into cuenta_usuario( idUsuario, correo, contrasena, telefono, apodo) 
  //  values
  //  ( (select idPersona from first_insert), $5, $6, $7, $8)
  //  RETURNING idUsuario
  // )
  // insert into informacion_cuenta ( idInformacion_cuenta, KmTotales, VelocidadPromedio, TiempoViaje, FotoPerfil) 
  // values 
  // ( (select idUsuario from second_insert), '0', '0', '0', '/')
  // `;

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
});

app.post("/createClub", (req, res) => {
  const idusuario = req.body.idusuario;
  const roles = req.body.roles;
  const nombreClub = req.body.nombreClub;
  let ids = [];

  let firstPart = `
    with first_insert as (
      insert into club(nombreclub, presidente 
  
  `

    let secondPart = `) values ($1, $2`;

    
    let lastIndex = 0;

    roles.forEach(([key, val], i) => {
      firstPart += `, ${key}`;
      secondPart += `, $${i+3}`;
      ids.push(val)
      lastIndex = i+3;
    });

    lastIndex += 1;

    let thirdPart = `) RETURNING id )
    
        insert into cuenta_club(idusuario, idclub)
        values (
          $${lastIndex}, (select id from first_insert)
        )
          
    `;

    let fourthPart = `;`;

    lastIndex += 1;

    roles.forEach(([key, val], i) => {
      thirdPart += `, ($${lastIndex+i}, (select id from first_insert))`;
    });

    let query = firstPart + secondPart + thirdPart + fourthPart;

    console.log(query);

    client.query(
      query,
      [nombreClub, idusuario, ...ids, idusuario, ...ids],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: 'Hubo un problema. Intenta más tarde.' }); //funciona como return
          return;
        }

        console.log(result)
        res.send({ created: true})
      }
    );
});

app.put("/update", (req, res) => {
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

        WHERE idUsuario = ( SELECT idUsuario from Cuenta WHERE correo = $7 )
        returning idUsuario;`,
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
});

app.listen(PORT, () => {
  console.log("Server running. Listening on port "+PORT);
});

/*
Insert

with first_insert as (
   insert into persona(nombre, ap, am, fechanac) 
   values('David', 'Carmona', 'Hinojosa', '1997-05-01') 
   RETURNING idPersona
), 
second_insert as (
  insert into cuenta_usuario( idUsuario, correo, contrasena, telefono, apodo) 
  values
  ( (select idPersona from first_insert), 'cahidavid@gmail.com', 'motos', 5520534037, 'potsbeat')
  RETURNING idUsuario
)
insert into informacion_cuenta ( idInformacion_cuenta, KmTotales, VelocidadPromedio, TiempoViaje) 
values 
( (select idUsuario from second_insert), '0', '0', '0');	

*/

/*

app.get('/userinfo', (req, res) => { // MySQL
    const email = [req.query.email];

    console.log('get userinfo: '+ email);
    db.query("SELECT Nombre, AP, AM FROM Persona WHERE idPersona = (SELECT idUsuario FROM Cuenta_Usuario WHERE Correo = $1) ", [email],
    (err, result) => {
        if(err){
            
            res.send({ error: err }); //funciona como return
        }
            console.log(result);
            res.send( { userdata: result[0]} )
        
    })
} )

*/
