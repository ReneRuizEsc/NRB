const express = require("express");
const cors = require("cors");
const Pool = require("pg").Pool;

require("dotenv").config();


/////// CONEXIÓN BASE DE DATOS ///////
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
/////////////////////////////////////



// Para las sesiones //
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const session = require("express-session");

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

////////////////////////////////////////////////////////////////////////////////////////////

//const {  } = require("./fn_queries/"); No borres esta wea

const { loginFn, membresiaFn } = require("./fn_queries/loginFile"); //email, password
const { addUserFn } = require("./fn_queries/addUserFile"); //email, username, name, ap, am, phone, birthDate, password
const { updateUserFn } = require("./fn_queries/updateUserFile"); //email, username, name, apellido1, apellido2, phone, tipodesangre

//Faltan por poner en front
const { addClubFn } = require("./fn_queries/addClubFile"); //idUsuario, nombreClub, reglamento(archivo), presentacion
const { addUserAllergyFn } = require("./fn_queries/addUserAllergy"); //idUsuario, alergia
const { verifyUserFn } = require("./fn_queries/verifyUserFile"); //idUsuario, fotofrontal, fototrasera, fotorostro
const { verifyAdminFn } = require("./fn_queries/verifyAdminFile"); //idUsuario
//const { addUserAddressFn } = require("./fn_queries/addUserAddressFile"); //idUsuario, pais, estado, municipio, colonia, calle, numero
//const { addMotorcycleFn } = require("./fn_queries/addMotorcycleFile"); //marca, modelo, placas, foto, tarjetaCirculacion, idusuario
//const { updateMotorcycleFn } = require("./fn_queries/updateMotorcycleFile"); //marca, modelo, placas, foto, tarjetaCirculacion, idusuario
//const { addAcompananteFn } = require("./fn_queries/addAcompananteFile"); //idusuario, nombre, ap, am, apodo, fotoperfil, numerotelefonico
//const { updateAcompananteFn } = require("./fn_queries/updateAcompananteFile"); //idusuario, nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico
//const { addAcompananteAllergyFn } = require("./fn_queries/addAcompananteAllergyFile"); //usuario, alergia 

////////////////////////////////////////////////////////////////////////////////////////////

//app.("/", (req, res) => (req, res, client)); Tampoco esta

app.post("/login", (req, res) => loginFn(req, res, client));
app.post("/createAccount", (req, res) => addUserFn(req, res, client));
app.put("/update", (req, res) => updateUserFn(req, res, client));
app.post("/createClub", (req, res) => addClubFn(req, res, client));

//Cambios en el front
app.post("/addAllergyUser", (req, res) => addUserAllergyFn(req, res, client));
app.post("/verifyUser", (req, res) => verifyUserFn(req, res, client));
app.put("/verifyAdmin", (req, res) => verifyAdminFn(req, res, client));
//app.post("/addAddressUser", (req, res) => addUserAddressFn(req, res, client));
//app.post("/addMotorcycle", (req, res) => addMotorcycleFn(req, res, client));
//app.put("/updateMotorcycle", (req, res) => updateMotorcycleFn(req, res, client));
//app.post("/addAcompanante", (req, res) => addAcompananteFn(req, res, client));
//app.put("/updateAcompanante", (req, res) => updateAcompananteFn(req, res, client));
//app.post("/addAcompananteAllergy", (req, res) => addAcompananteAllergyFn(req, res, client));
app.post("/loginInfoClub", (req, res) => membresiaFn(req, res, client));

////////////////////////////////////////////////////////////////////////////////////////////

app.get("/checkLogin", (req, res) => {
  // Este get sirve para verificar si hay una sesión guardada
  if (req.session.user) {
    res.send({ isLogged: true, user: req.session.user });
  } else {
    res.send({ isLogged: false });
  }
});

app.post("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  } else {
    res.send({ isLogged: false });
  }
});

app.listen(PORT, () => {
  console.log("Server running. Listening on port "+PORT);
});

//////////////////////////////////////////////////////////////////////////////////////////// c: