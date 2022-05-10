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

const frontendURL = process.env.FRONTEND;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [frontendURL],
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
      maxAge: 30 * 24 * 60 * 1000, //30 días
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

const db = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "nicerider",
  password: "pikachu09",
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

app.get("/login", (req, res) => {
  // Este get sirve para verificar si hay una sesión guardada
  if (req.session.user) {
    res.send({ isLogged: true, user: req.session.user });
  } else {
    res.send({ isLogged: false });
  }
});

app.get("/userinfo", (req, res) => {
  const email = [req.query.email];

  client.query(
    "SELECT Nombre, AP, AM, Telefono, Apodo FROM Persona INNER JOIN Cuenta_Usuario ON idPersona = (SELECT idUsuario FROM Cuenta_Usuario WHERE Correo = $1) ",
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

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  client.query(
    "SELECT Correo FROM Cuenta_Usuario WHERE Correo = $1 AND Contrasena = $2",
    [email, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ error: err }); //funciona como return
        return;
      }

      if (result.rows.length > 0) {
        // si el usuario existe,
        req.session.user = result.rows; //crear una sesión para el usuario
        console.log("sesión creada");
        console.log(req.session.user);
        res.send(result.rows);
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

app.put("/update", (req, res) => {
  const [email, username, name, apellido1, apellido2, phone] = [
      req.body.email,
    req.body.username,
    req.body.name,
    req.body.apellido1,
    req.body.apellido2,
    req.body.phone
  ];

  client.query(
    `with persona_update as (
        UPDATE Persona
         SET nombre = $1, 
             ap = $2, 
             am = $3
               
        WHERE idPersona = ( SELECT idUsuario from Cuenta_Usuario WHERE correo = $4 )
        returning idPersona
      )
      UPDATE Cuenta_Usuario 
        SET Apodo = $5, telefono = $6
      WHERE idUsuario IN (select idPersona from persona_update);`,
    [name, apellido1, apellido2, email, username, phone],
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

app.listen(3001, () => {
  console.log("Server running.");
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
    db.query("SELECT Nombre, AP, AM FROM Persona WHERE idPersona = (SELECT idUsuario FROM Cuenta_Usuario WHERE Correo = ?) ", [email],
    (err, result) => {
        if(err){
            
            res.send({ error: err }); //funciona como return
        }
            console.log(result);
            res.send( { userdata: result[0]} )
        
    })
} )

*/
