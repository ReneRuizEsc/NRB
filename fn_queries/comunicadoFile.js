////////////////////////////////////////////////////////////////////////////////////////////

//Club add, update, delete, show(User), show(Club) || Club address update

////////////////////////////////////////////////////////////////////////////////////////////

const crypto = require("crypto");
const { getFileExtension } = require("../generalFn/generalFn");
const pathObj = require('path');
const fs = require('fs');

////////////////////////////////////////////////////////////////////////////////////////////

const addComunicadoFn = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 8 || req.session.user.cargo !== 1) //1: presidente, 8: secretario
  res.send("Hubo un problema");

    const idclub = req.body.idclub;
    const descripcion = req.body.descripcion;
    const cuerpo = req.body.mensaje;
  
      let query = `
        INSERT INTO comunicado (descripcion, cuerpo, club)
        VALUES ($1, $2, $3)
        ;`

      client.query(
        query,
        [descripcion, cuerpo, idclub],
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
    if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)
    res.send("Hubo un problema");

    const idcomunicado = req.body.idcomunicado;
    const descripcion = req.body.descripcion;
    const cuerpo = req.body.mensaje;
  
      const query = `
        UPDATE comunicado
            SET descripcion = $1,
            cuerpo = $2,
            where idcomunicado = $3
        ;`

      client.query(
        query,
        [descripcion, cuerpo, idcomunicado],
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

const deleteComunicadoFn = (req, res, client) => { //De momento no se borran los archivos xd

  const idcomunicado = req.body.idcomunicado;

    let query = `
      DELETE from archivos_comunicado
      WHERE idcomunicado_fk = $1;

      DELETE from fotos_comunicado
      WHERE idfoto_fk = $1;

      DELETE from comunicado
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

const showComunicadoListFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
      SELECT descripcion, cuerpo from comunicado
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
  if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)
  res.send("Hubo un problema");

    const idClub = req.body.idclub;
    const idcomunicado = req.body.idcomunicado;
    const photo = req.files.foto;
    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);

    let filepath = [];

    Object.entries(photo).forEach(([key, value]) => {

      if(key == 'foto')
      {
          filepath.push(`${__dirname}/../files/club/${idClub}/images/fotoComunicado-${randStr}${fileExt}`);
          value.mv(`${__dirname}/../files/club/${idClub}/images/fotoComunicado-${randStr}${fileExt}`, (err) => console.log(err))
      }
    })
  
      const queryStr = `
      INSERT INTO fotos_comunicado (idcomunicado, foto)
      VALUES ($1, $2)
        ;`

        for (let i = 0; i < filepath.length; i++)
        {
            client.query(queryStr, [idcomunicado, filepath[i]], (err, result) => {
                if (err)
                {
                    console.log("No se ha subido la imagen "+ i +" con éxito.")
                }
                else
                {
                    console.log("Se ha subido la imagen "+ i +" con éxito.")
                }
            });
        }
      res.send({ created: true})
  }

////////////////////////////////////////////////////////////////////////////////////////////

const deleteComunicadoPicturesFn = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)
  res.send("Hubo un problema");

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
            res.send({ error: 'No fue borrada la foto del comunicado' });
            return;
          }

          try {
            fs.unlinkSync(foto)
            console.log("Foto de comunicado borrada.");
          } catch (error) {
            console.log(error);
          }
          res.send({message: "Foto de comunicado borrada."})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

const addComunicadoFilesFn = (req, res, client) => {

  const idClub = req.body.idclub;
  const idcomunicado = req.body.idcomunicado;
  const archivo = req.body.archivo;
  const randStr = crypto.randomBytes(5).toString('hex');
  let fileExt;

  let filepath = [];

  Object.entries(archivo).forEach(([key, value]) => {

    fileExt = getFileExtension(value.name);

    if(key == 'archivo')
    {
        filepath.push(`${__dirname}/../files/club/${idClub}/files/archivosComunicado-${randStr}${fileExt}`);
        value.mv(`${__dirname}/../files/club/${idClub}/files/archivosComunicado-${randStr}${fileExt}`, (err) => console.log(err))
    }
    })
  
        const queryStr = `
          INSERT INTO archivos_comunicado (idcomunicado, archivo)
          VALUES ($1, $2)
          ;`

        for (let i = 0; i < filepath.length; i++)
        {
            client.query(queryStr, [idcomunicado, filepath[i]],
            (err, result) => {
                if (err)
                {
                    console.log("No se ha subido el archivo "+ i + " con éxito.")
                }
                else
                {
                    console.log("Se ha subido el archivo "+ i +" con éxito.")
                }
            });
    
        }
    
        res.send({ created: true})
  }

////////////////////////////////////////////////////////////////////////////////////////////

const deleteComunicadoFilesFn = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)
  res.send("Hubo un problema");

    const archivo = req.body.archivo;
  
      const queryStr = `
        DELETE FROM archivos_comunicado
        WHERE archivo = $1
        ;`

      client.query(
        queryStr,
        [archivo],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No fue borrado el archivo del comunicado' });
            return;
          }

          try {
            fs.unlinkSync(archivo)
            console.log("Archivo de comunicado borrado.");
          } catch (error) {
            console.log(error);
          }
          res.send({message: "Archivo de comunicado borrado."})
        }
      );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { addComunicadoFn, updateComunicadoFn, deleteComunicadoFn, showComunicadoFn, showComunicadoListFn, addComunicadoPicturesFn, deleteComunicadoPicturesFn, addComunicadoFilesFn, deleteComunicadoFilesFn }

////////////////////////////////////////////////////////////////////////////////////////////