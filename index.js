const express = require('express');
const cors = require('cors');
const mysql = require("mysql");

// Para las sesiones //
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
///////////////////////

const frontendURL = '192.168.0.36:3000';

const app = express()
app.use(express.json());
app.use(cors({
    origin: [`http://${frontendURL}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: 'userId',
    secret: 'alicia la loca',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*168
    }
}))


// Conexión con la base de datos //
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "pikachu09",
    database: "nicerider"
});
///////////////////////////////////

app.get('/login', (req,res) => { // Este get sirve para verificar si hay una sesión guardada
    if (req.session.user){
        res.send({ isLogged: true, user: req.session.user });
    }else{
        res.send({ isLogged: false });
    }
});

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    db.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if(err){
                res.send({ error: err }); //funciona como return
            }

            if(result.length>0){            // si el usuario existe,
                req.session.user = result; //crear una sesión para el usuario
                console.log(req.session.user);
                res.send(result);
            }
                
            else
                res.send({ message:  'Usuario o contraseña incorrectos.'});
        }
    );
});

app.listen(3001, ()=>{
    console.log('Server running.');
})