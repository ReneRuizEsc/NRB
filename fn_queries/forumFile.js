const addEntryFn = (req, res, client) => {
    const idUsuario = req.body.idusuario;
    const titulo = req.body.titulo;
    const mensaje = req.body.texto;

    let query = `
    WITH asd as (SELECT idMembresia FROM miembros_club WHERE idUsuario_fk = $1)
        INSERT INTO publicacion_foro (titulo, texto, respuesta, fecha, idmmiembro_fk)
        VALUES ($2, $3, NULL, (SELECT current_date), (SELECT idMembresia FROM asd))
        ;`

        client.query(
            query,
            [idUsuario, titulo, mensaje],
            (err, result) => {
              if (err)
              {
                console.log(err);
                res.send({ error: 'No se realizó la publicacion en el foro' });
                return;
              }
      
              console.log(result)
              res.send({ created: true})
            }
          );

}

const deleteEntryFn = (req, res, client) => {
    const idPublicacion = req.body.idpublicacion;

    let query = `
        DELETE FROM fotos_foro
        WHERE idPublicacionForo_fk = $1;

        DELETE FROM archivos_foro
        WHERE idPublicacionForo_fk = $1;

        DELETE FROM publicacion_foro
        WHERE idPublicacion = $1
        ;`

        client.query(
            query,
            [idPublicacion],
            (err, result) => {
              if (err)
              {
                console.log(err);
                res.send({ error: 'No se realizó el borrado de la publicacion' });
                return;
              }
      
              console.log(result)
              res.send({ created: true})
            }
          );
    
}

const addResponseFn = (req, res, client) => {
    const idUsuario = req.body.idusuario;//El que responde
    const idPublicacion = req.body.idpublicacion;//A donde responde
    const titulo = req.body.titulo;
    const mensaje = req.body.texto;
    
    let query = `
    WITH asd as (SELECT idMembresia FROM miembros_club WHERE idUsuario_fk = $1), 
        INSERT INTO publicacion_foro (titulo, texto, respuesta, fecha, idmmiembro_fk)
        VALUES ($3, $4, $2, (SELECT current_date), (SELECT idMembresia FROM asd)
        ;`

        client.query(
            query,
            [idUsuario, idPublicacion, titulo, mensaje],
            (err, result) => {
              if (err)
              {
                console.log(err);
                res.send({ error: 'No se realizó la respuesta en el foro' });
                return;
              }
      
              console.log(result)
              res.send({ created: true})
            }
          );
}

const showEntryMAINListFn = (req, res, client) => {//////////////////////////////////////////////////GET
    const idPublicacion = req.body.idPublicacion;
    
    let query = `
        SELECT titulo, texto, fecha, apodo FROM publicacion_foro
        INNER JOIN miembro_club ON idMiembro_fk = idMembresia
        INNER JOIN usuario ON idUsuario_fk = idusuario WHERE respuesta = NULL
        ;`

        client.query(
            query,
            [idPublicacion],
            (err, result) => {
              if (err)
              {
                console.log(err);
                res.send({ error: 'No se realizó la respuesta en el foro' });
                return;
              }
      
              console.log(result)
              res.send({ created: true})
            }
          );
}

const showEntryResponseListFn = (req, res, client) => {
    const idPublicacion = req.body.idPublicacion;
    
    let query = `
        SELECT titulo, texto, fecha, apodo FROM publicacion_foro
        INNER JOIN miembro_club ON idMiembro_fk = idMembresia
        INNER JOIN usuario ON idUsuario_fk = idusuario WHERE respuesta = $1
        ;`

        client.query(
            query,
            [idPublicacion],
            (err, result) => {
              if (err)
              {
                console.log(err);
                res.send({ error: 'No se realizó la consulta de respuestas' });
                return;
              }

              //showEntryFilesFn(req, res, client);//await Quizá se muere por mandar varias respuestas
      
              console.log(result)
              res.send({ created: true})
            }
          );
}

const showEntryFilesFn =   (req, res, client) => {
    const idPublicacion = req.body.idPublicacion;

    const query = `
      SELECT archivo from archivo_foro WHERE idPublicacionForo_fk = $1;
    `;

    /* client.query(
      query, 
      [idPublicacion], 
      (err, result)=>{
          if(err)
            return;
          else{

            if(result.rows.length < 1){
                return;
            }else{
                for(let i = 0; i < result.rows.length; i++)
                {   
                    //const path = result.rows[i].foto;
                    //console.log("Logo path: ", path)
                    //res.sendFile(pathObj.resolve(path));//Lo matará?
                }
                return;
            }

          }
      });*/
}

const showEntryPicturesFn =  (req, res, client) => {

}

//Ver que pedo con las múltiples entradas 
const addFileForumFn = (req, res, client) => {
    if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.archivo;
  const idusuario = req.session.user.idusuario;
  const idPublicacion = req.req.body.idpublicacion;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  let filepath = [];

    Object.entries(file).forEach(([key, value]) => {

        if(key == 'archivo')
        {
            filepath.push(`${__dirname}/../files/users/${idusuario}/files/archivosforo-${randStr}${fileExt}`);
            value.mv(`${__dirname}/../files/users/${idusuario}/files/archivosforo-${randStr}${fileExt}`, (err) => console.log(err))
        }
    })

    for (let i = 0; i < filepath.length; i++)
    {
        let query = 'INSERT INTO archivos_foro (idPublicacionForo_fk, archivo) VALUES ($1, $2)';
        client.query(query, [idPublicacion, filepath[i]],
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

const addPictureForumFn = (req, res, client) => {
    if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const photo = req.files.foto;
  const idusuario = req.session.user.idusuario;
  const idPublicacion = req.req.body.idpublicacion;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  let filepath = [];

    Object.entries(photo).forEach(([key, value]) => {

        if(key == 'foto')
        {
            filepath.push(`${__dirname}/../files/users/${idusuario}/images/fotoforo-${randStr}${fileExt}`);
            value.mv(`${__dirname}/../files/users/${idusuario}/images/fotoforo-${randStr}${fileExt}`, (err) => console.log(err))
        }
    })

    for (let i = 0; i < filepath.length; i++)
    {
        let query = 'INSERT INTO fotoss_foro (idPublicacionForo_fk, foto) VALUES ($1, $2)';
        client.query(query, [idPublicacion, filepath[i]],
        (err, result) => {
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