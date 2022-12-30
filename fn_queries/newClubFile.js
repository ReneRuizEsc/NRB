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
// Debe ser usuario verificado && No pertenece a algun club -> Queda asignado como presidente

// Nombre, Reglamento, Presentacion <- Club
// idUsuario_FK, idClub_FK, FechaIngreso, FechaRenovacion, SuscripcionMeses <- Miembro_Club
// idMiembro_FK, 1 <- Cargos

const newClubFn = (req, res) => {
    const idusuario = req.body.idusuario;

    const nombre = req.body.nombreClub;
    const reglamento = req.body.reglamento;
    const presentacion = req.body.presentacion;

    //Esto puede ser un dolor de calcular
    const mesesSuscripcion = 0;
    //El creador del club no tiene membresía
    const fechaRenovacion = new Date("12-31-2099");

    //Fecha de ingreso el día de creación del club
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const fechaIngreso = `${month}-${day}-${year}`;

    // 1: Presidente, 2: Vicepresidente, 3: Sargento de armas, 4: Tesorero
    // 5: Capitan de ruta, 6: Prospect, 7: Miembro; 8: Enforcer (Sin uso en la plataforma)
    const cargo = 1;
  
      let query = `
      with first_insert as (
        insert into club( nombre, reglamento, presentacion) 
        values ($1, $2, $3) RETURNING idClub),
      second_insert as (insert into Miembro_Club (SuscripcionMeses, FechaRenovacion, FechaIngreso, idClub_FK, idUsuario_FK) 
        values ($4, $6, $7, (select idClub from first_insert), $8) RETURNING idMembresia)
        insert into cargos(idMiembro_FK, Cargo_FK)
        values ((select idMembresia from second_insert), $9)
        ;`
  
      client.query(
        query,
        [idusuario, nombre, reglamento, presentacion, mesesSuscripcion, fechaRenovacion, fechaIngreso, cargo],
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