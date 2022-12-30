const express = require("express");
const cors = require("cors");

require("dotenv").config();

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

//const {  } = require("./fn_queries/");

const { loginFn } = require("./fn_queries/loginFile"); //email, password
const { newUserFn } = require("./fn_queries/newUserFile"); //email, username, name, ap, am, phone, birthDate, password
const { updateUserFn } = require("./fn_queries/updateUserFile"); //email, username, name, apellido1, apellido2, phone, tipodesangre

//Faltan por poner en front
const { newClubFn } = require("./fn_queries/newClubFile"); //idUsuario, nombreClub, reglamento(archivo), presentacion
const { allergyAggUFn } = require("./fn_queries/newAllergyUFile"); //idUsuario, alergia
const { verifyUserFn } = require("./fn_queries/verifyUserFile"); //idUsuario, fotofrontal, fototrasera, fotorostro
const { verifyAdminFn } = require("./fn_queries/verifyAdminFile"); //idUsuario

////////////////////////////////////////////////////////////////////////////////////////////

//app.("/", (req, res) => (req, res));

app.post("/login", (req, res) => loginFn(req, res));
app.post("/createAccount", (req, res) => newUserFn(req, res));
app.put("/update", (req, res) => updateUserFn(req, res));
app.post("/createClub", (req, res) => newClubFn(req, res));

//Cambios en el front
app.post("/addAllergyUser", (req, res) => allergyAggUFn(req, res));
app.post("/verifyUser", (req, res) => verifyUserFn(req, res));
app.put("/verifyAdmin", (req, res) => verifyAdminFn(req, res));

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