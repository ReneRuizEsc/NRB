const frontend = require('./config/frontendLink');

const express = require('express');
const cors = require('cors');
const mysql = require("mysql");

// Para las sesiones //
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');
const session = require('express-session');
///////////////////////

const frontendURL = `http://${frontend.ip}:${frontend.port}`;

const app = express();
app.use(express.json());
app.use(cors({
    origin: [frontendURL],
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

app.get('/userinfo', (req, res) => {
    const username = [req.query.username];
console.log('get userinfo: '+ username);
    db.query("SELECT `name`, `apellido1`, `apellido2` FROM users WHERE `username` = ? ", [username],
    (err, result) => {
        if(err){
            
            res.send({ error: err }); //funciona como return
        }
            console.log(result);
            res.send( { userdata: result[0]} )
        
    })
} )

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    db.query(
        "SELECT username, email FROM users WHERE username = ? AND password = ?",
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

app.post('/logout', (req, res)=>{
    if (req.session.user){
        req.session.destroy()
        
    }else{
        res.send({ isLogged: false });
    }
})

app.put('/update', (req, res)=>{
    const [username, name, apellido1, apellido2] = [req.body.username, req.body.name, req.body.apellido1, req.body.apellido2];

    db.query("UPDATE `users` SET `name` = ?, `apellido1` = ?, `apellido2` = ? WHERE `username` = ? ", 
        [name, apellido1, apellido2, username], 
        (err, result) => {
            if(err){
                res.send({ error: err }); //funciona como return
            }else{
                console.log(result);
                res.send( {message: 'Actualización exitosa.', user: result} )
            }
            
        }
        );
}
);



app.listen(3001, ()=>{
    console.log('Server running.');
})