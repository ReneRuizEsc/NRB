////////////////////////////////////////////////////////////////////////////////////////////

//Club Event

////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const crypto = require("crypto");
const pathObj = require('path');
const { getFileExtension } = require("../generalFn/generalFn");

////////////////////////////////////////////////////////////////////////////////////////////

//Individual user can create public event

const addClubEventFn = (req, res, client) => {

  const idclub = req.body.idclub;
  const titulo = req.body.titulo;
  const descripcion = req.body.descripcion;
  const fecha = req.body.descripcion;
  const hora = req.body.descripcion;
  const file = req.files.image;//Poster

  const inicioLat = req.body.salidaLat;
  const inicioLong = req.body.salidaLong;
  const finLat = req.body.destinoLat;
  const finLong = req.body.destinoLong;

  const fileExt = getFileExtension(file.name);

  const randStr = crypto.randomBytes(5).toString('hex');
  const path =`${__dirname}/../files/club/${idclub}/images/Poster-${randStr}${fileExt}`;

  file.mv(path, (err) => {console.log(err);})

    let query = `
      with first_insert as (
        INSERT INTO evento( titulo, descripcion, fecha, hora, ruta, club, poster)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING idevento_individual)
      INSERT INTO puntos_evento_individual, ideventoindividual_fk, salidaLat, salidaLong, destinoLat, detinoLong)
        VALUES((SELECT idevento_individual FROM first_insert), $8, $9, $10, $11)
        ;`

    client.query(
      query,
      [titulo, descripcion, fecha, hora, '', idclub, path, inicioLat, inicioLong, finLat, finLong],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No se realizó el registro del evento' });
          return;
        }

        console.log(result)
        res.send({ created: true})
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

const addClubEventRouteFn = (req, res, client) => {

  const idclub = req.body.idclub;
  const idEvento = req.body.idEvento;
  const file = req.file.route;

  
  const fileExt = getFileExtension(file.name);

  const randStr = crypto.randomBytes(5).toString('hex');
  const path =`${__dirname}/../files/club/${idclub}/images/Poster-${randStr}${fileExt}`;

  file.mv(path, (err) => {console.log(err);})

    let query = `
      UPDATE evento
      SET route = $1
      WHERE idevento = $2
        ;`

    client.query(
      query,
      [path, idEvento],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No se realizó el cambio en la ruta del evento' });
          return;
        }

        console.log(result)
        res.send({ created: true})
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Given idevento_individual it gets deleted.

const deleteClubEventFn = (req, res, client) => { //Nadie necesita borrar archivos

  const idevento = req.body.idevento;

    let query = `
        DELETE FROM puntos_evento
        WHERE idEvento_fk = $1;

        DELETE FROM archivos_evento
        WHERE idEvento_fk = $1;

        DELETE FROM foto_evento
        WHERE idEvento_fk = $1;

        DELETE FROM recuento_acontecimientos
        WHERE idEvento = $1;

        DELETE from evento
        WHERE idevento = $1
        ;`

    client.query(
      query,
      [idevento],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No fue eliminado el evento' });
          return;
        }

        console.log(result)
        res.send({ created: true})
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

// idUsuario = All user events

const showClubEventListFn = (req, res, client) => {
    //const idusuario = req.body.idusuario;
  
    const queryStr = `
      SELECT * FROM evento 
      INNER JOIN puntos_evento on idevento = idevento_fk
      ;`
  
    client.query(
      queryStr,
      [],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0)
        {
          res.send(result.rows);
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

// idevento_individual = all info individual event and location

const showClubEventDetailsFn = (req, res, client) => {
    const idevento = req.body.idevento;
  
    const queryStr = `
        SELECT * FROM evento
        INNER JOIN puntos_evento on idevento_fk = idevento 
        WHERE idevento = $1
        ;`
  
    client.query(
      queryStr,
      [idevento],
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

// idevento_individual = location info

const showClubEventPointsFn = (req, res, client) => {
    const idevento = req.body.idevento;
  
    const queryStr = `
      SELECT salidalat, destinolat, titulo, descripcion, poster, fechaderealizacion, hora FROM puntos_evento
      WHERE idevento_fk = $1
      ;`
  
    client.query(
      queryStr,
      [idevento],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: err });
        }
  
        if (result.rows.length > 0)
        {
          res.send(result.rows);
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

module.exports = { addClubEventFn, addClubEventRouteFn, deleteClubEventFn, showClubEventListFn, showClubEventDetailsFn, showClubEventPointsFn }

////////////////////////////////////////////////////////////////////////////////////////////