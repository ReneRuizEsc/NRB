////////////////////////////////////////////////////////////////////////////////////////////

// idClub = all info of direccion_club, colores_club, club.

const infoClubClubFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
    select * from club 
    inner join direccion_club on direccion_club.idclub_fk = idclub 
    inner join colores_club on colores_club.idclub_fk = idclub 
    where idclub = $1;
      `;
  
    client.query(
      queryStr,
      [idclub],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.send({ message: "" });
          console.log(result);
        }
      }
    );
}

// idUser = all info of direccion_club, colores_club, club.

const infoUserClubFn = (req, res, client) => {
    const user = req.body.idusuario;
  
    const queryStr = `
    select * from miembro_club
    INNER JOIN club on idclub = miembro_club.idclub_fk 
    INNER JOIN direccion_club on direccion_club.idclub_fk = miembro_club.idclub_fk
    INNER JOIN colores_club on colores_club.idclub_fk = miembro_club.idclub_fk and idusuario_fk = $1
      `;
  
    client.query(
      queryStr,
      [user],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.send({ message: "" });
          console.log(result);
        }
      }
    );
}

// idClub = idUsuario, nombre, fotoperfil, fechaIngreso, cargo_fk (aquí puedes ignorar la tabla y poner 
// 1: presidente, 2: vicepresidente, 3: sgto de armas, 4: tesorero, 5: capitán de ruta, 6: prospect, 7: miembro)

const miembrosClubFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
    select idusuario_fk, nombre, fotoPerfil, fechaIngreso, cargo_fk from miembro_club
    inner join cargos on idmembresia = idmiembro_fk
    inner join cargos_descripcion on cargo_fk = idcargo
    inner join usuario on idusuario = idusuario_fk where idclub_fk = $1;
      `;
  
    client.query(
      queryStr,
      [idclub],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.send({ message: "" });
          console.log(result);
        }
      }
    );
}

module.exports = { infoClubClubFn, infoUserClubFn, miembrosClubFn}

////////////////////////////////////////////////////////////////////////////////////////////