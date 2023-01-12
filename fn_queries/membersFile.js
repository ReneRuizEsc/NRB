////////////////////////////////////////////////////////////////////////////////////////////

//Members

////////////////////////////////////////////////////////////////////////////////////////////

var nodemailer = require('nodemailer');

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
  const idusuario = req.body.idusuario;//del usuario aceptado
  const idmembresia = req.body.idmembresia;
  const idclub = req.body.idclub;

  const queryStr = `
      UPDATE miembro_club
      SET pendiente = false,
      fechaingreso = (select current_date)
      WHERE idusuario_fk = $1;

      UPDATE usuario
      SET hasmembresia = TRUE
      WHERE idUsuario = $1;

      INSERT INTO cargos (idMiembro_FK, Cargo_FK)
      VALUES ($2, 7)
      ;`;//6 es prospect, 7 es miembro

      req.session.user = {...req.session.user, cargo: 7 };

  client.query(
    queryStr,
    [idusuario, idmembresia],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No se registró la respuesta a la solicitud' });
        return;
      }

      let nombreclub;
      let email;

      client.query('SELECT nombre FROM club where idclub = $1', idclub, (err, resp) =>
      {
        nombreclub = resp.rows[0].nombre;
      });

      client.query('SELECT correo FROM cuenta INNER JOIN usuario ON idusuario = idcuenta_fk where idcuenta = $1', idusuario, (err, resp) =>
      {
        correo = resp.rows[0].correo;
      });

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ttmotosescom@gmail.com',
          pass: 'aixmgdgdafdofbdc'
        }
      });

      let mailOptions = {
        from: 'ttmotosescom@gmail.com',
        to: email,
        subject: 'Aceptado en club.',
        text: 'Su solicitud de unirse al club ' + nombreclub + ' ha sido aceptada '
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send({message: "ok"});

      console.log(result)
      res.send({ created: true})
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

const newMemberClubRejectFn = (req, res, client) => {
  const idusuario = req.body.idusuario;
  const idmembresia = req.body.idmembresia;
  const idclub = req.body.idclub;

  const queryStr = `
      DELETE FROM miembro_club
      WHERE idMembresia = $1;
      ;`

  client.query(
    queryStr,
    [idmembresia],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No se registró la respuesta a la solicitud' });
        return;
      }

      let nombreclub;
      let email;

      client.query('SELECT nombre FROM club where idclub = $1', idclub, (err, resp) =>
      {
        nombreclub = resp.rows[0].nombre;
      });

      client.query('SELECT correo FROM cuenta INNER JOIN usuario ON idusuario = idcuenta_fk where idcuenta = $1', idusuario, (err, resp) =>
      {
        correo = resp.rows[0].correo;
      });

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ttmotosescom@gmail.com',
          pass: 'aixmgdgdafdofbdc'
        }
      });

      let mailOptions = {
        from: 'ttmotosescom@gmail.com',
        to: email,
        subject: 'Solicitud de ingreso rechazada.',
        text: 'Su solicitud de unirse al club ' + nombreclub + ' ha sido rechazada. '
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send({message: "ok"});

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

const deleteAmonestacion = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 3 || req.session.user.cargo !== 1) //1: presidente, 8: secretario
  res.send("Hubo un problema");

  const idamonestacion = req.body.amonestacion;

  const queryStr = `
    DELETE FROM amonestaciones
    WHERE idAmonestacion = $1
    ;`

  client.query(
    queryStr,
    [idamonestacion],
    (err, result) => {
      if (err)
      {
        console.log(err);
        res.send({ error: 'No fue borrada' });
        return;
      }

      res.send({ message: "Fue borrada la amonestacion" });
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { newMemberClubFn, newMemberClubAcceptFn, newMemberClubRejectFn, showMiembrosClubFn, addAmonestacion, deleteAmonestacion }

////////////////////////////////////////////////////////////////////////////////////////////