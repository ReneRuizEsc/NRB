const express = require("express");
const cors = require("cors");
const Pool = require("pg").Pool;

require("dotenv").config();
const fileUpload = require("express-fileupload");

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
    origin: [frontendURL, 'http://nicerider.site', 'http://www.nicerider.site'],
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
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: oneDay,
      //sameSite: 'strict',

      secure: "auto",
      httpOnly: true,
      sameSite: 'strict',
    },
  })
);

// Para carga de archivos
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  createParentPath: true
}));

////////////////////////////////////////////////////////////////////////////////////////////
//Club
const { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn, showClubListFn, updateClubAddressFn, updateClubRanksFn, missingRanksFn , showPointListFn} = require("./fn_queries/clubFile");
//Login
const { loginFn, restorePassword } = require("./fn_queries/loginFile");
//Members
const { showSolicitudState, newMemberClubFn, newMemberClubAcceptFn, newMemberClubRejectFn, showMiembrosClubFn, addAmonestacion, deleteAmonestacion, deleteFromClub } = require("./fn_queries/membersFile");
//Other
const { verifyStatusFn, verifyUserFn, verifyAdminFn, notVerifyAdminFn, showPendingVerificationFn, getCredencialF, getCredencialT, getFotoRostro, allUsers } = require("./fn_queries/otherFunctionsFile");
//Companion
const { addUserCompanionFn, updateUserCompanionFn, updateProfilePicCompanion, deleteUserCompanionFn, showUserCompanionFn, addCompanionIllnessFn, deleteCompanionIllnessFn, showCompanionIllnessFn } = require("./fn_queries/userCompanionFile");
//UserData
const { addUserAddressFn, updateUserAddressFn, deleteUserAddressFn, showUserAddressFn, addUserIllnessFn, deleteUserIllnessFn, showUserIllnessFn } = require("./fn_queries/userDataFile");
//User
const { addUserFn, updateUserFn, deleteUserFn, showUserFn, updateContrasenaFn } = require("./fn_queries/userFile");
//Moto
const { addUserMotorcycleFn, updateUserMotorcycleFn, deleteUserMotorcycleFn, showUserMotorcycleFn } = require("./fn_queries/userMotorcycleFile");
//UserEvent
const { addUserEventFn, updateUserEventFn, deleteUserEventFn, showUserEventListFn, showUserEventEventFn, showUserEventPointsFn, showEventPointsListFn } = require("./fn_queries/userEventFile");
//Upload
const { uploadProfilePic } = require("./fn_upload/uploadFn");//Salvame del olvido
//Download
const { getProfilePic, getClubLogo, downloadTest, getClubLogoNombre, getClubLogoUbic, printGeneralFileFn } = require("./fn_download/download");
//Comunicado
const { addComunicadoFn, updateComunicadoFn, deleteComunicadoFn, showComunicadoFn, showComunicadoListFn, addComunicadoPicturesFn, deleteComunicadoPicturesFn, addComunicadoFilesFn, deleteComunicadoFilesFn } = require("./fn_queries/comunicadoFile");
//Forum
const { addEntryFn, deleteEntryFn, addResponseFn, showEntryMAINListFn, showEntryResponseListFn, showEntryFilesFn, showEntryPicturesFn, addPictureForumFn, addFileForumFn } = require("./fn_queries/forumFile");
//DemosKratos
//const {  } = require("./fn_queries/demosKratos.js");
//GeneralReports
//ClubEvents
//Agreements
//Sponsor
//SponsorSpace

////////////////////////////////////////////////////////////////////////////////////////////

//Login
app.post("/login", (req, res) => loginFn(req, res, client)); //email, password
app.post("/restorePassword", (req, res) => restorePassword(req, res, client)); //email

// Downloads and Pictures
app.get("/getProfilePic", (req, res) => getProfilePic(req, res, client));
app.get("/downloadTest", (req, res) => downloadTest(req, res, client));
app.get("/getClubLogo", (req, res) => getClubLogo(req, res, client));
app.get("/getClubLogoNombre", (req, res) => getClubLogoNombre(req, res, client));
app.get("/getClubLogoUbic", (req, res) => getClubLogoUbic(req, res, client));


//Others
app.post("/verifyStatus", (req, res) => verifyStatusFn(req, res, client));
app.post("/verifyUser", (req, res) => verifyUserFn(req, res, client));
app.put("/pendingVerification", (req, res) => showPendingVerificationFn(req, res, client));
app.put("/allUsers", (req, res) => allUsers(req, res, client));
app.get("/getCredencialF", (req, res) => getCredencialF(req, res, client));
app.get("/getCredencialT", (req, res) => getCredencialT(req, res, client));
app.get("/getFotoRostro", (req, res) => getFotoRostro(req, res, client));

app.put("/verifyAdmin", (req, res) => verifyAdminFn(req, res, client));//Aceptar verificacion-----------------------------------
app.put("/notverifyAdmin", (req, res) => notVerifyAdminFn(req, res, client));

//Club
app.post("/createClub", (req, res) => addClubFn(req, res, client));
app.put("/updateClub", (req, res) => updateClubFn(req, res, client));
app.post("/delteClub", (req, res) => deleteClubFn(req, res, client));
app.post("/showClubClub", (req, res) => showClubClubFn(req, res, client));
app.post("/showUserClub", (req, res) => showUserClubFn(req, res, client));
app.post("/showClublist", (req, res) => showClubListFn(req, res, client));
app.put("/updateClubAddress", (req, res) => updateClubAddressFn(req, res, client));

app.put("/showPointListClub", (req, res) => showPointListFn(req, res, client));

//Members
app.post("/newMemberClub", (req, res) => newMemberClubFn(req, res, client));
app.post("/infoClubMembers", (req, res) => showMiembrosClubFn(req, res, client));

app.post("/deleteFromClub", (req, res) => deleteFromClub(req, res, client));//Borrar miembro o salir de club

app.post("/newMemberClubAccept", (req, res) => newMemberClubAcceptFn(req, res, client));//Aceptar miembro de club-------------------------------------
app.post("/newMemberClubReject", (req, res) => newMemberClubRejectFn(req, res, client));

app.get("/showSolicitudState", (req, res) => showSolicitudState(req, res, client));

//UserCompanion
app.post("/addAcompanante", (req, res) => addUserCompanionFn(req, res, client));
app.put("/updateAcompanante", (req, res) => updateUserCompanionFn(req, res, client));
app.post("/deleteAcompanante", (req, res) => deleteUserCompanionFn(req, res, client));
app.post("/showAcompananteInfo", (req, res) => showUserCompanionFn(req, res, client));
app.post("/addAcompananteIllness", (req, res) => addCompanionIllnessFn(req, res, client));
app.post("/deleteAcompananteIllness", (req, res) => deleteCompanionIllnessFn(req, res, client));
app.post("/showAcompananteIllness", (req, res) => showCompanionIllnessFn(req, res, client));

//UserData
app.post("/addAddressUser", (req, res) => addUserAddressFn(req, res, client));
app.put("/updateUserAddress", (req, res) => updateUserAddressFn(req, res, client));
app.post("/deleteUserAddress", (req, res) => deleteUserAddressFn(req, res, client));
app.post("/showUserAddress", (req, res) => showUserAddressFn(req, res, client));
app.post("/addIllnessUser", (req, res) => addUserIllnessFn(req, res, client));
app.post("/deleteUserIllness", (req, res) => deleteUserIllnessFn(req, res, client));
app.post("/showUserIllness", (req, res) => showUserIllnessFn(req, res, client));

//User
app.post("/createAccount", (req, res) => addUserFn(req, res, client));
app.put("/update", (req, res) => updateUserFn(req, res, client));
app.post("/deleteUser", (req, res) => deleteUserFn(req, res, client));
app.post("/showUser", (req, res) => showUserFn(req, res, client));
app.put("/updateContrasena", (req, res) => updateContrasenaFn(req, res, client));

//Motorcycle
app.post("/addMotorcycle", (req, res) => addUserMotorcycleFn(req, res, client));
app.put("/updateMotorcycle", (req, res) => updateUserMotorcycleFn(req, res, client));
app.post("/deletemotorcycle", (req, res) => deleteUserMotorcycleFn(req, res, client));
app.post("/showMotorcycleInfo", (req, res) => showUserMotorcycleFn(req, res, client));

//IndividualEvent
app.post("/addUserEvent", (req, res) => addUserEventFn(req, res, client));
app.put("/updateUserEvent", (req, res) => updateUserEventFn(req, res, client));
app.post("/deleteUserEvent", (req, res) => deleteUserEventFn(req, res, client));
app.post("/showUserEventList", (req, res) => showUserEventListFn(req, res, client));
app.post("/showUserEventEvent", (req, res) => showUserEventEventFn(req, res, client));
app.post("/showUserEventPoints", (req, res) => showUserEventPointsFn(req, res, client));

app.put("/showEventPointsList", (req, res) => showEventPointsListFn(req, res, client));

//UPLOAD
app.post("/uploadProfilePic", (req, res) => uploadProfilePic(req, res, client));

//Forum
app.post("/addEntry", (req, res) => addEntryFn(req, res, client));
app.post("/deleteEntry", (req, res) => deleteEntryFn(req, res, client));
app.post("/addResponse", (req, res) => addResponseFn(req, res, client));
app.post("/showMainList", (req, res) => showEntryMAINListFn(req, res, client));
app.post("/showEntryResponseList", (req, res) => showEntryResponseListFn(req, res, client));
app.post("/showEntryFiles", (req, res) => showEntryFilesFn(req, res, client));
app.post("/showEntryPictures", (req, res) => showEntryPicturesFn(req, res, client));
app.post("/addPictureForum", (req, res) => addPictureForumFn(req, res, client));
app.post("/addFileForum", (req, res) => addFileForumFn(req, res, client));

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
    req.session.destroy( (err) => {
      if(err)
        res.status(400).send('Error al cerrar sesión')
      else
        res.status(200).send("Ok")
    } );
  } else {
    res.send({ isLogged: false });
  }
});

app.listen(PORT, () => {
  console.log("Server running. Listening on port "+PORT);
});

//////////////////////////////////////////////////////////////////////////////////////////// c: