//////////////////////////////////////////////////////////////////////////////////////////// 

const newMemberClubFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const club = req.body.idclub;
  
    const queryStr = `
        INSERT into miembro_club (suscripcionmeses, fecharenovacion, fechaingreso, idclub_fk, idusuario_fk, pendiente)
        VALUES (0, '12/31/1999', '12/31/1999', $1, $2, true);
      
      `;
  
    client.query(
      queryStr,
      [idusuario, club],
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

const newMemberClubAdminFn = (req, res, client) => {
  const idusuario = req.body.idusuario;
  const club = req.body.idclub;

  const queryStr = `
      UPDATE miembro_club
      SET pendientes = $1,
      fechaingreso = CURRENT_DATE
      suscripcionmeses

    
    `;

  client.query(
    queryStr,
    [idusuario, club],
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

module.exports = { newMemberClubFn, newMemberClubAdminFn }

////////////////////////////////////////////////////////////////////////////////////////////