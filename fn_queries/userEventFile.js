////////////////////////////////////////////////////////////////////////////////////////////

//UserEvent add, update, delete, show(with user), show(with event), showList, updateLocation

////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const crypto = require("crypto");
const pathObj = require('path');
const { getFileExtension } = require("../generalFn/generalFn");

////////////////////////////////////////////////////////////////////////////////////////////

//Individual user can create public event

const addUserEventFn = (req, res, client) => {

    const idusuario = req.body.idusuario;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const fecha = req.body.descripcion;
    const hora = req.body.descripcion;
    const files = req.files;

    const inicioLat = req.body.salidaLat;
    const inicioLong = req.body.salidaLong;
    const finLat = req.body.destinoLat;
    const finLong = req.body.destinoLong;

    const randStr = crypto.randomBytes(5).toString('hex');
    let fileExt, poster, ruta;

    Object.entries(files).forEach(([key, value]) => {
      fileExt = getFileExtension(value.name);

        if(key == 'poster')
        {
            poster = `${__dirname}/../files/users/${id}/images/poster-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/poster-${randStr}${fileExt}`, (err) => console.log(err))
        }
        if(key == 'ruta')
        {
            ruta = `${__dirname}/../files/users/${id}/files/ruta-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/files/ruta-${randStr}${fileExt}`, (err) => console.log(err))
        }
    })
  
      let query = `
        with first_insert as (
          INSERT INTO evento_individual( titulo, descripcion, fecha, hora, ruta, idusuario, poster)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING idevento_individual)
        INSERT INTO puntos_evento_individual, ideventoindividual_fk, salidaLat, salidaLong, destinoLat, detinoLong)
          VALUES((SELECT idevento_individual FROM first_insert), $8, $9, $10, $11)
          ;`

      client.query(
        query,
        [titulo, descripcion, fecha, hora, ruta, idusuario, poster, inicioLat, inicioLong, finLat, finLong],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el registro del evento individual' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  //Update info of individual Event and location

  const updateUserEventFn = (req, res, client) => { //SE DEBEN SUBIR AMBOS ARCHIVOS PD. NO SE BORRAN LAS FOTOS

    const idevento_individual = req.body.idevento_individual;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const fecha = req.body.descripcion;
    const hora = req.body.descripcion;
    const files = req.files;

    const inicioLat = req.body.salidaLat;
    const inicioLong = req.body.salidaLong;
    const finLat = req.body.destinoLat;
    const finLong = req.body.destinoLong;

    let poster = '';
    let ruta = '';

    Object.entries(files).forEach(([key, value]) => {
        fileExt = getFileExtension(value.name);
  
          if(key == 'poster')
          {
              poster = `${__dirname}/../files/users/${id}/images/poster-${randStr}${fileExt}`;
              value.mv(`${__dirname}/../files/users/${id}/images/poster-${randStr}${fileExt}`, (err) => console.log(err))
          }
          if(key == 'ruta')
          {
  
            ruta = `${__dirname}/../files/users/${id}/images/ruta-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/ruta-${randStr}${fileExt}`, (err) => console.log(err))
          }
    })
  
      let query = `
        UPDATE evento_individual
        SET titulo = $1,
        descripcion = $2,
        fecha = $3,
        hora = $4,
        ruta = $5,
        poster = $6
        WHERE idevento_individual = $7;

        UPDATE puntos_evento_individual
        SET salidaLat = $8,
        salidaLong = $9,
        destinoLat = $10,
        destinoLong = $11
        WHERE idevento_individual = $7
        ;`

      client.query(
        query,
        [titulo, descripcion, fecha, hora, ruta, poster, idevento_individual, inicioLat, inicioLong, finLat, finLong],
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

//Given idevento_individual it gets deleted.

const deleteUserEventFn = (req, res, client) => {

  const idevento_individual = req.body.idevento_individual;

  client.query('SELECT poster, ruta FROM evento_individual WHERE idevento_individual = $1;',
        [idevento_individual],
        (err, result) => {
            try {
              fs.unlinkSync(result.rows[0].poster);
              fs.unlinkSync(result.rows[0].ruta);
              console.log("Old pictures deleted");
            } catch (error) {
              console.log(error);
            }
          });

    let query = `
        DELETE from evento_individual
        WHERE idevento_individual = $1
        ;`

    client.query(
      query,
      [idevento_individual],
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

const showUserEventListFn = (req, res, client) => {
    //const idusuario = req.body.idusuario;
  
    const queryStr = `
      SELECT * FROM evento_individual 
      INNER JOIN puntos_evento_individual on ideventoindividual_fk = idevento_individual
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

// idevento_individual = all info individual event and location

const showUserEventEventFn = (req, res, client) => {
    const idevento_individual = req.body.idevento_individual;
  
    const queryStr = `
        SELECT * FROM evento_individual 
        INNER JOIN puntos_evento_individual on ideventoindividual_fk = idevento_individual 
        WHERE idevento_individual = $1
        ;`
  
    client.query(
      queryStr,
      [idevento_individual],
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

const showUserEventPointsFn = (req, res, client) => {
    const idevento_individual = req.body.idevento_individual;
  
    const queryStr = `
      SELECT * FROM puntos_evento_individual
      WHERE ideventoindividual_fk = $1
      ;`
  
    client.query(
      queryStr,
      [idevento_individual],
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

module.exports = { addUserEventFn, updateUserEventFn, deleteUserEventFn, showUserEventListFn, showUserEventEventFn, showUserEventPointsFn }

////////////////////////////////////////////////////////////////////////////////////////////