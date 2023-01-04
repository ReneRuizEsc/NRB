////////////////////////////////////////////////////////////////////////////////////////////

//UserEvent add, update, delete, show(with user), show(with event), showList, updateLocation

////////////////////////////////////////////////////////////////////////////////////////////

//Individual user can create public event

const addUserEventFn = (req, res, client) => {

    const idusuario = req.body.idusuario;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const fecha = req.body.descripcion;
    const hora = req.body.descripcion;
    const ruta = req.body.descripcion;
    const poster = req.body.descripcion;

    const inicioLat = req.body.salidaLat;
    const inicioLong = req.body.salidaLong;
    const finLat = req.body.destinoLat;
    const finLong = req.body.destinoLong;
  
      let query = `
      with first_insert as (
        INSERT INTO evento_individual( titulo, descripcion, fecha, hora, ruta, idusuario, poster)
        values ($1, $2, $3, $4, $5, $6, $7) RETURNING idevento_individual)
		INSERT INTO puntos_evento_individual, ideventoindividual_fk, salidaLat, salidaLong, destinoLat, detinoLong)
        VALUES((select idevento_individual from first_insert), $8, $9, $10, $11)
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

  const updateUserEventFn = (req, res, client) => {

    const idevento_individual = req.body.idevento_individual;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const fecha = req.body.descripcion;
    const hora = req.body.descripcion;
    const ruta = req.body.descripcion;
    const poster = req.body.descripcion;

    const inicioLat = req.body.salidaLat;
    const inicioLong = req.body.salidaLong;
    const finLat = req.body.destinoLat;
    const finLong = req.body.destinoLong;
  
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
    const idusuario = req.body.idusuario;
  
    const queryStr = `
      SELECT * FROM evento_individual 
      INNER JOIN puntos_evento_individual on ideventoindividual_fk = idevento_individual 
      where idusuario_fk = $1
      ;`
  
    client.query(
      queryStr,
      [idusuario],
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