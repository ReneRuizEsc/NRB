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

const newClubFn = (req, res) => {
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
  }

  module.exports = { newClubFn }

////////////////////////////////////////////////////////////////////////////////////////////