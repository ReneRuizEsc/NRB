////////////////////////////////////////////////////////////////////////////////////////////

//Club add, update, delete, show(User), show(Club) || Club address update

////////////////////////////////////////////////////////////////////////////////////////////

// Debe ser usuario verificado && No pertenece a algun club -> Queda asignado como presidente

const addComunicadoFn = (req, res, client) => {

    const idclub = req.body.idclub;
    const descripcion = req.body.descripcion;
    const cuerpo = req.body.mensaje;
  
      let query = `
        INSERT INTO comunicado (descripcion, cuerpo, club)
        VALUES ($1, $2, $3)
        ;`

      client.query(
        query,
        [idclub, descripcion, cuerpo],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el registro del comunicado' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////

  const updateComunicadoFn = (req, res, client) => {

    const idcomunicado = req.body.idcomunicado;
    const descripcion = req.body.descripcion;
    const cuerpo = req.body.mensaje;
  
      let query = `
        UPDATE comunicado
            SET descripcion = $1,
            cuerpo = $2,
            where idcomunicado = $3
        ;`

      client.query(
        query,
        [idcomunicado, descripcion, cuerpo],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizaron cambios en los datos' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

const deleteComunicadoFn = (req, res, client) => {

  const idcomunicado = req.body.idcomunicado;

    let query = `DELETE from comunicado
      WHERE idcomunicado = $1
      ;`

    client.query(
      query,
      [idcomunicado],
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

const showComunicadoFn = (req, res, client) => {
    const idcomunicado = req.body.idcomunicado;
  
    const queryStr = `
      SELECT descripcion, cuerpo from comunicado
      where idcomunicado = $1
      ;`
  
    client.query(
      queryStr,
      [idcomunicado],
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

// idClub = all info of direccion_club, colores_club, club.

const showComunicadoListFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
      SELECT * from comunicado
      WHERE idclub = $1
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

// idUser = all info of direccion_club, colores_club, club.

const addComunicadoPicturesFn = (req, res, client) => {

    const idcomunicado = req.body.idusuario;
    const foto = req.body.foto;
  
      let query = `
      INSERT INTO fotos_comunicado (idcomunicado, foto)
      VALUES ($1, $2)
        ;`

      client.query(
        query,
        [idcomunicado, foto],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se subió la fotografía' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

// idUser = all info of direccion_club, colores_club, club.

const deleteComunicadoPicturesFn = (req, res, client) => {

    const foto = req.body.foto;
  
      let query = `
      DELETE FROM fotos_comunicado
      WHERE foto = $1
        ;`

      client.query(
        query,
        [foto],
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

const addComunicadoFilesFn = (req, res, client) => {

    const idcomunicado = req.body.idusuario;
    const archivo = req.body.archivo;
  
      let query = `
      INSERT INTO archivos_comunicado (idcomunicado, archivo)
      VALUES ($1, $2)
        ;`

      client.query(
        query,
        [idcomunicado, archivo],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el registro del archivo' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

// idUser = all info of direccion_club, colores_club, club.

const deleteComunicadoFilesFn = (req, res, client) => {

    const archivo = req.body.archivo;
  
    let query = `
    DELETE FROM archivos_comunicado
    WHERE foto = $1
      ;`

    client.query(
      query,
      [archivo],
    (err, result) => {
        if (err)
        {
        console.log(err);
        res.send({ error: 'No se borró el archivo' });
        return;
        }

        console.log(result)
        res.send({ created: true})
    }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn, showClubListFn, updateClubAddressFn }

////////////////////////////////////////////////////////////////////////////////////////////