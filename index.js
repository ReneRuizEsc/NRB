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

const { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn } = require("./fn_queries/clubFile");
const { loginFn } = require("./fn_queries/loginFile");
const { newMemberClubFn, newMemberClubAcceptFn, newMemberClubRejectFn, showMiembrosClubFn } = require("./fn_queries/membersFile");
const { verifyStatusFn, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn } = require("./fn_queries/otherFunctionsFile");
const { addUserCompanionFn, updateUserCompanionFn, deleteUserCompanionFn, showUserCompanionFn, addCompanionAllergyFn, deleteCompanionAllergyFn, showCompanionAllergyFn } = require("./fn_queries/userCompanionFile");
const { addUserAddressFn, updateUserAddressFn, deleteUserAddressFn, showUserAddressFn, addUserAllergyFn, deleteUserAllergyFn, showUserAllergyFn } = require("./fn_queries/userDataFile");
const { addUserFn, updateUserFn, deleteUserFn, showUserFn, updateContrasenaFn } = require("./fn_queries/userFile");
const { addUserMotorcycleFn, updateUserMotorcycleFn, deleteUserMotorcycleFn, showUserMotorcycleFn } = require("./fn_queries/userMotorcycleFile");

////////////////////////////////////////////////////////////////////////////////////////////

//app.("/", (req, res) => (req, res, client)); Tampoco esta

//Login
app.post("/login", (req, res) => loginFn(req, res, client)); //email, password

//Others { verifyStatusFn, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn }
app.post("/verifyUser", (req, res) => verifyStatusFn(req, res, client));
app.post("/verifyUser", (req, res) => verifyUserFn(req, res, client));
app.put("/verifyAdmin", (req, res) => verifyAdminFn(req, res, client));
app.put("/verifyAdmin", (req, res) => notVerifyAdminFn(req, res, client));
app.put("/pendingVerification", (req, res) => showPendingVerificationFn(req, res, client));

//Club { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn }
app.post("/createClub", (req, res) => addClubFn(req, res, client));
app.put("/updateClub", (req, res) => updateClubFn(req, res, client));
app.post("/delteClub", (req, res) => deleteClubFn(req, res, client));
app.post("/showClubClub", (req, res) => showClubClubFn(req, res, client));
app.post("/showUserClub", (req, res) => showUserClubFn(req, res, client));

//Members { newMemberClubFn, newMemberClubAcceptFn, newMemberClubRejectFn, showMiembrosClubFn }
app.post("/infoUserClub", (req, res) => newMemberClubFn(req, res, client));
app.post("/infoClubClub", (req, res) => newMemberClubAcceptFn(req, res, client));
app.post("/infoClubClub", (req, res) => newMemberClubRejectFn(req, res, client));
app.post("/infoClubMembers", (req, res) => showMiembrosClubFn(req, res, client));

//UserCompanion { addUserCompanionFn, updateUserCompanionFn, deleteUserCompanionFn, showUserCompanionFn, addCompanionAllergyFn, deleteCompanionAllergyFn, showCompanionAllergyFn }
app.post("/addAcompanante", (req, res) => addUserCompanionFn(req, res, client));
app.put("/updateAcompanante", (req, res) => updateUserCompanionFn(req, res, client));
app.post("/deleteAcompanante", (req, res) => deleteUserCompanionFn(req, res, client));
app.post("/showAcompananteInfo", (req, res) => showUserCompanionFn(req, res, client));
app.post("/addAcompananteAllergy", (req, res) => addCompanionAllergyFn(req, res, client));
app.post("/deleteAcompananteAllergy", (req, res) => deleteCompanionAllergyFn(req, res, client));
app.post("/showAcompananteAllergy", (req, res) => showCompanionAllergyFn(req, res, client));

//UserData { addUserAddressFn, updateUserAddressFn, deleteUserAddressFn, showUserAddressFn, addUserAllergyFn, deleteUserAllergyFn, showUserAllergyFn }
app.post("/addAddressUser", (req, res) => addUserAddressFn(req, res, client));
app.put("/updateUserAddress", (req, res) => updateUserAddressFn(req, res, client));
app.post("/deleteUserAddress", (req, res) => deleteUserAddressFn(req, res, client));
app.post("/showUserAddress", (req, res) => showUserAddressFn(req, res, client));
app.post("/addAllergyUser", (req, res) => addUserAllergyFn(req, res, client));
app.post("/deleteUserAllergy", (req, res) => deleteUserAllergyFn(req, res, client));
app.post("/showUserAllergy", (req, res) => showUserAllergyFn(req, res, client));

//User { addUserFn, updateUserFn, deleteUserFn, showUserFn, updateContrasenaFn }
app.post("/createAccount", (req, res) => addUserFn(req, res, client));
app.put("/update", (req, res) => updateUserFn(req, res, client));
app.post("/deleteUser", (req, res) => deleteUserFn(req, res, client));
app.post("/showUser", (req, res) => showUserFn(req, res, client));
app.put("/updateContrasena", (req, res) => updateContrasenaFn(req, res, client));

//Motorcycle { addUserMotorcycleFn, updateUserMotorcycleFn, deleteUserMotorcycleFn, showUserMotorcycleFn }
app.post("/addMotorcycle", (req, res) => addUserMotorcycleFn(req, res, client));
app.put("/updateMotorcycle", (req, res) => updateUserMotorcycleFn(req, res, client));
app.post("/deletemotorcycle", (req, res) => deleteUserMotorcycleFn(req, res, client));
app.post("/showMotorcycleInfo", (req, res) => showUserMotorcycleFn(req, res, client));

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