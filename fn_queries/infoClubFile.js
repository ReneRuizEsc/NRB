//////////////////////////////////////////////////////////////////////////////////////////// 

const infoClubFm = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
    select * from club 
    inner join direccion_club on direccion_club.idclub_fk = idclub 
    inner join colores_club on colores_club.idclub_fk = idclub 
    where idclub = $1;
      `;
  
    client.query(
      //"SELECT Correo FROM Cuenta_Usuario WHERE Correo = $1 AND Contrasena = $2"
      queryStr,
      [idclub],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err }); //funciona como return
          //return;
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

const miembrosClubFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
    select idusuario_fk, nombre from miembro_club
    inner join cargos on idmembresia = idmiembro_fk
    inner join cargos_descripcion on cargo_fk = idcargo
    inner join usuario on idusuario = idusuario_fk where idclub_fk = $1;
      `;
  
    client.query(
      //"SELECT Correo FROM Cuenta_Usuario WHERE Correo = $1 AND Contrasena = $2"
      queryStr,
      [idclub],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: err }); //funciona como return
          //return;
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

module.exports = { infoClubFm, miembrosClubFn}

////////////////////////////////////////////////////////////////////////////////////////////