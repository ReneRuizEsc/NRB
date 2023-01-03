////////////////////////////////////////////////////////////////////////////////////////////

//Club add, update, delete, show(User), show(Club)

////////////////////////////////////////////////////////////////////////////////////////////

// Debe ser usuario verificado && No pertenece a algun club -> Queda asignado como presidente

const addClubFn = (req, res, client) => {

    const idusuario = req.body.idusuario;
    const nombre = req.body.nombreClub;
    const reglamento = req.body.reglamento;
    const presentacion = req.body.presentacion;

    //Esto queda sin usar
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
        [nombre, reglamento, presentacion, mesesSuscripcion, fechaRenovacion, fechaIngreso, idusuario, cargo],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el registro del club' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  const updateClubFn = (req, res, client) => {

    const idclub = req.body.idclub;
    const nombre = req.body.nombreClub;
    const reglamento = req.body.reglamento;
    const presentacion = req.body.presentacion;
  
      let query = `UPDATE Club
        SET nombre = $1,
        reglamento = $2,
        presentacion = $3
        where idclub = $4
        ;`

      client.query(
        query,
        [nombre, reglamento, presentacion, idclub],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el cambio de datos' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

const deleteClubFn = (req, res, client) => {

  const idclub = req.body.idclub;

    let query = `DELETE from club
      WHERE idclub = $1
      ;`

    client.query(
      query,
      [idclub],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No fue eliminado el club' });
          return;
        }

        console.log(result)
        res.send({ created: true})
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

// idClub = all info of direccion_club, colores_club, club.

const showClubClubFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
      select * from club 
      inner join direccion_club on direccion_club.idclub_fk = idclub 
      inner join colores_club on colores_club.idclub_fk = idclub 
      where idclub = $1
      ;`
  
    client.query(
      queryStr,
      [idclub],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0)
        {
          res.send(result.rows[0]);
        }
        else
        {
          res.send({ message: "No existen registros" });
          console.log(result);
        }
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

// idUser = all info of direccion_club, colores_club, club.

const showUserClubFn = (req, res, client) => {
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
        if (err)
        {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0)
        {
          res.send(result.rows[0]);
        }
        else
        {
          res.send({ message: "" });
          console.log(result);
        }
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn }

////////////////////////////////////////////////////////////////////////////////////////////