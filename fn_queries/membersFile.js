////////////////////////////////////////////////////////////////////////////////////////////

//Members

////////////////////////////////////////////////////////////////////////////////////////////

//Solicitar unirse a club

const newMemberClubFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const club = req.body.idclub;
  
    const queryStr = `
        INSERT into miembro_club (kmreccorridos, fecharenovacion, fechaingreso, idclub_fk, idusuario_fk, pendiente)
        VALUES (0, '12/31/1999', '12/31/1999', $1, $2, true)
        ;`
  
    client.query(
      queryStr,
      [club, idusuario],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No se realizó el registro del miembro del club' });
          return;
        }
  
        console.log(result)
        res.send({ created: true})
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Aceptar miembro

const newMemberClubAcceptFn = (req, res, client) => {
  const idusuario = req.body.idusuario;

  const queryStr = `
      UPDATE miembro_club
      SET pendiente = false,
      fechaingreso = (select current_date)
      WHERE idusuario_fk = $1;

      INSERT INTO cargos (idMiembro_FK, Cargo_FK)
      VALUES ($1, 6)
      ;`

  client.query(
    queryStr,
    [idusuario],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No se registró la respuesta a la solicitud' });
        return;
      }

      console.log(result)
      res.send({ created: true})
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

const newMemberClubRejectFn = (req, res, client) => {
  const idusuario = req.body.idusuario;

  const queryStr = `
      UPDATE miembro_club
      SET pendiente = false,
      WHERE idusuario_fk = $1;
      ;`

  client.query(
    queryStr,
    [idusuario],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No se registró la respuesta a la solicitud' });
        return;
      }

      console.log(result)
      res.send({ created: true})
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

// 1: presidente, 2: vicepresidente, 3: sgto de armas, 4: tesorero, 5: capitán de ruta, 6: prospect, 7: miembro, 8: secretario)

const showMiembrosClubFn = (req, res, client) => {
  const idclub = req.body.idclub;

  const queryStr = `
    select idusuario_fk, nombre, fotoPerfil, fechaIngreso, cargo_fk from miembro_club
    inner join cargos on idmembresia = idmiembro_fk
    inner join cargos_descripcion on cargo_fk = idcargo
    inner join usuario on idusuario = idusuario_fk where idclub_fk = $1
    ;`

  client.query(
    queryStr,
    [idclub],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No se muestran los miembros del club' });
        return;
      }

      if (result.rows.length > 0)
      {
        res.send(result.rows[0]);
      }
      else
      {
        res.send({ message: "No hay miembros del club" });
        console.log(result);
      }
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

const addAmonestacion = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 3 || req.session.user.cargo !== 1) //1: presidente, 8: secretario
  res.send("Hubo un problema");
  const idusuario = req.session.user.idusuario;
  const motivo = req.body.motivo;
  const descripcion = req.body.descripcion;
  const idmembresia = req.body.idmembresia;

  const queryStr = `
    WITH asd as (SELECT clavedeelector FROM verificacion WHERE idUsuario_fk = $1)
    INSERT INTO amonestaciones (fecha, motivo, descripcion, miembroclub_fk, clavedeelector)
    VALUES ((SELECT current_date), $2, $3, $4, (SELECT clavedeelector from asd))
    ;`

  client.query(
    queryStr,
    [idusuario, motivo, descripcion, idmembresia],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No fue realizada la amonestacion' });
        return;
      }

      res.send({ message: "Fue realizada la amonestacion" });
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { newMemberClubFn, newMemberClubAcceptFn, newMemberClubRejectFn, showMiembrosClubFn }

////////////////////////////////////////////////////////////////////////////////////////////