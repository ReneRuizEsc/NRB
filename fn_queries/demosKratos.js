////////////////////////////////////////////////////////////////////////////////////////////

//

////////////////////////////////////////////////////////////////////////////////////////////

const crypto = require("crypto");
const { getFileExtension } = require("../generalFn/generalFn");
const pathObj = require('path');
const fs = require('fs');

////////////////////////////////////////////////////////////////////////////////////////////

const addVotacion = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 1)
  res.send("Hubo un problema");

    const idclub = req.body.idclub;
    const fecha = req.body.fecha;
    const descripcion = req.body.mensaje;
  
      let query = `
        INSERT INTO VOTACIONES (fecha, descripcion, club)
        VALUES ($1, $2, $3)
        ;`

      client.query(
        query,
        [fecha, descripcion, idclub],
        (err, result) => {
          if (err)
          {
            console.log(err);
            res.send({ error: 'No se realizó el registro de la votacion' });
            return;
          }
  
          console.log(result)
          res.send({ created: true})
        }
      );
  }

////////////////////////////////////////////////////////////////////////////////////////////

const addVotacionPregunta = (req, res, client) => {
if(!req.session?.user || req.session.user.cargo !== 1)
res.send("Hubo un problema");

    const idvotacion = req.body.idvotacion;
    const pregunta = req.body.pregunta;
    const votos = 0;

    let query = `
        INSERT INTO preguntas_votacion (id_votacion, pregunta, votos)
        VALUES ($1, $2, $3)
        ;`

    client.query(
        query,
        [idvotacion, pregunta, votos],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó el registro de la pregunta' });
            return;
        }

        console.log(result)
        res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

const showVotacionInfo = (req, res, client) => {
if(!req.session?.user || req.session.user.cargo !== 8 || req.session.user.cargo !== 1)
    res.send("Hubo un problema");

const idvotacion = req.body.idvotacion;

let query = `
    SELECT fecha, descripcion, archivo FROM votaciones
    INNER JOIN archivos_votacion on idvotacion = idvotacion_fk
    WHERE idvotacion = $1
    ;`

client.query(
    query,
    [idvotacion],
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

const showVotacionPreguntas = (req, res, client) => {
    if(!req.session?.user || req.session.user.cargo !== 8 || req.session.user.cargo !== 1)
        res.send("Hubo un problema");
    
    const idvotacion = req.body.idvotacion;
    
    let query = `
        SELECT pregunta, votos FROM preguntas_votacion
        WHERE id_votacion = $1
        ;`
    
    client.query(
        query,
        [idvotacion],
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

const showVotacionList = (req, res, client) => {
    if(!req.session?.user || req.session.user.cargo !== 8 || req.session.user.cargo !== 1) //1: presidente, 8: secretario
    res.send("Hubo un problema");
    
    const idclub = req.body.idclub;

    let query = `
        SELECT fecha, descripcion FROM votaciones
        WHERE idClub = $1
        ;`

    client.query(
        query,
        [idclub],
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

const addSufragio = (req, res, client) => {
if(!req.session?.user)
    res.send("Hubo un problema");

    const pregunta = req.body.pregunta
    const idMembresia = req.body.idMembresia;
    const idvotacion = req.body.idVotacion;

    client.query('SELECT idMiembro FROM lista_votaciones WHERE idMiembro = $1 AND idvotacion = $2;',
    [idMembresia, idvotacion],
    (err, result) => {
        if (err)
        {
        console.log(err);
        res.send({ error: 'Error en la consulta' });
        return;
        }
        else{
            if(result.length>0)
            {
                res.send({ error: 'El usuario ya votó' });
                return;
            }
            client.query('UPDATE preguntas_votacion SET votos = votos + 1 where pregunta = $3;', [pregunta], (err, result) =>{
                if (err)
                {
                console.log(err);
                res.send({ error: 'No se realizó el voto' });
                return;
                }
                else{
                    res.send({ message: 'Voto registrado' });
                    return;
                }
            })
        }
    }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

/*const deleteComunicadoFn = (req, res, client) => { //De momento no se borran los archivos xd
  if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)//Presidente o vicepresidente
    res.send("Hubo un problema");

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

const addComunicadoPicturesFn = (req, res, client) => {
  if(!req.session?.user || req.session.user.cargo !== 1 || req.session.user.cargo !== 2)
  res.send("Hubo un problema");

    const idClub = req.body.idclub;
    const idcomunicado = req.body.idcomunicado;
    const photo = req.files;
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
  const archivo = req.body;
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
*/
////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { addComunicadoFn, updateComunicadoFn, deleteComunicadoFn, showComunicadoFn, showComunicadoListFn, addComunicadoPicturesFn, deleteComunicadoPicturesFn, addComunicadoFilesFn, deleteComunicadoFilesFn }

////////////////////////////////////////////////////////////////////////////////////////////