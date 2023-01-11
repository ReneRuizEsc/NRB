const crypto = require("crypto");
const { getFileExtension } = require("../generalFn/generalFn");
////////////////////////////////////////////////////////////////////////////////////////////

//Club add, update, delete, show(User), show(Club) || Club address update

////////////////////////////////////////////////////////////////////////////////////////////

// Debe ser usuario verificado && No pertenece a algun club -> Queda asignado como presidente

const addClubFn = (req, res, client) => {

  const idusuario = req.session.user.idusuario;
  const nombre = req.body.nombreClub;
  const presentacion = req.body.presentacion;

  //Esto queda sin usar
  const mesesSuscripcion = 0;
  //El creador del club no tiene membresía
  const fechaRenovacion = new Date("2099-12-31");

  // 1: Presidente, 2: Vicepresidente, 3: Sargento de armas, 4: Tesorero
  // 5: Capitan de ruta, 6: Prospect, 7: Miembro; 8: Enforcer (Sin uso en la plataforma)
  const cargo = 1;

  const pais = req.body.pais;
  const estado = req.body.estado;
  const municipio = req.body.municipio;
  const colonia = req.body.colonia;
  const calle = req.body.calle;
  const numero = req.body.numero;
  const direccionLat = req.body.direccionLat;
  const direccionLong = req.body.direccionLong;

  const files = req.files;

  console.log(req.body, req.files)


    let query = `
    with first_insert as (
      INSERT INTO club( nombre, reglamento, presentacion) 
      values ($1, $2, $3) RETURNING idClub),
  
    second_insert as (INSERT INTO Miembro_Club (kmrecorridos, FechaRenovacion, FechaIngreso, idClub_FK, idUsuario_FK) 
      values ($4, $5, (SELECT current_date), (select idClub from first_insert), $6) RETURNING idMembresia),
  
    third_insert as (INSERT INTO cargos(idMiembro_FK, Cargo_FK)
      values ((select idMembresia from second_insert), $7)),
  
    fourth_insert as( INSERT INTO direccion_club (pais, estado, municipio, colonia, calle, numero, direccionlat, direccionlong, idclub_fk)
      VALUES ($8, $9, $10, $11, $12, $13, $14, $15, (select idClub from first_insert))),
  
    fifth_clause as( INSERT INTO colores_club (idclub_fk, logo, logo_ubicacion, logo_nombre_club)
      VALUES ((select idClub from first_insert), $16, $17, $18)),

    sixt_clause as (
      UPDATE usuario
      SET hasmembresia = true
      WHERE idusuario = $6
    )

    SELECT idClub from first_insert
      ;`

    client.query(
      query,
      [nombre, "", presentacion, mesesSuscripcion, fechaRenovacion, idusuario, cargo, pais, estado, municipio, colonia, calle, numero, direccionLat, direccionLong, "", "", ""],
      (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No se realizó el registro del club' });
          return;
        }

        console.log(result)

        if(Object.keys(files).length < 1)
          return res.send({created: true})

        const idClub = result.rows[0].idclub;
        const randStr = crypto.randomBytes(5).toString('hex');
        let queryStr = `
            UPDATE colores_club
            SET 
        `
        let queryStrMid = ` `;
        let queryStrEnd = ` WHERE idclub_fk = ${idClub}`;

        /// queryAdicional se usará para hacer un simple select o para insertar el reglamento.
        /// el select solo es para que no se rompa
        let hasReglamento = false;
        let queryAdicional = ` 
          UPDATE club 
          SET reglamento = `;

        Object.entries(files).forEach(async ([key, file])=>{
            let targetPath = `${__dirname}/../files/clubes/${idClub}/`; 
            console.log("Mostrando entries: ", Object.entries(file))
            if(key === "reglamento"){
                targetPath = targetPath + `files/${key}-${randStr}${getFileExtension(file.name)}`;
                queryAdicional += `'${targetPath}' WHERE idclub = ${idClub}`
                hasReglamento = true;
            }
            else{
                targetPath = targetPath + `images/colores/${key}-${randStr}${getFileExtension(file.name)}`;
                queryStrMid += ` ${key} = '${targetPath}', `;
            }
              
            await file.mv(targetPath, (err) => console.log(err))
        })

        queryStrMid = queryStrMid.replace(/,\s*$/gm, '');
        
        let finalQuery = queryStr + queryStrMid + queryStrEnd;

        console.log(finalQuery)

        client.query(finalQuery, (err, result)=>{
            if (err){
              console.log(err);
              res.send({ error: 'No se realizó el registro del club' });
              return;
            }else{
                console.log(result)
                if(!hasReglamento){
                  console.log("CLUB CREADO SIN REGLAMENTO");
                  req.session.user = {
                    ...req.session.user,
                    hasmembresia: true
                  };
                  return res.send({ created: true, idclub: idClub});
                }

                //// AHORA LA QUERY PARA LA UBICACIÓN DEL REGLAMENTO /////
                client.query(queryAdicional, (err, ress) => {
                  if(err){
                    console.log("ERROR AL AGREGAR EL REGLAMENTO")

                    return res.send({err: 'error'})
                  }

                  console.log("CLUB CREADO con REGLAMENTO")
                  console.log("SESIÓN: ", req.session.user)
                  req.session.user = {
                    ...req.session.user,
                    hasmembresia: true
                  }
                  return res.send({created: true, idclub: idClub})
                })

            }
        })

        
      }
    );
}

  ////////////////////////////////////////////////////////////////////////////////////////////----------------------------------------------------------

  const updateClubFn = (req, res, client) => {

    const idclub = req.body.idclub;
    const nombre = req.body.nombreClub;
    const reglamento = req.files.reglamento;
    const presentacion = req.body.presentacion;

    const randStr = crypto.randomBytes(5).toString('hex');//Solucion temporal al no borrar archivos
    const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/club/${idclub}/files/reglamento-${randStr}${fileExt}`;

    client.query('SELECT reglamento FROM club WHERE idclub = $1;', idclub, (err, result) =>
    {
      if(err){
        console.log(err);
      }
      else{
        try {
          fs.unlinkSync(reglamento)//Borra el viejo
        } catch (error) {
          console.log(error);
        }
      }

    })

    file.mv(path, (err) => { if (err) {
          return res.status(500).send(err); //Al subir el nuevo reglamento
      }});
  
      const queryStr = `
        UPDATE Club
        SET nombre = $1,
        reglamento = $2,
        presentacion = $3
        where idclub = $4
        ;`

      client.query( queryStr, [nombre, path, presentacion, idclub], (err, result) => {
        if (err)
        {
          console.log(err);
          res.send({ error: 'No se realizó el cambio de datos' });
          return;
        }

        console.log(result)
        res.send({ created: true})
      });
  }

//////////////////////////////////////////////////////////////////////////////////////////// Tampoco aquí se borran archivos

const deleteClubFn = (req, res, client) => {

  const idclub = req.body.idclub;

    let query = `
    DELETE from acuerdo WHERE idclub_fk = $1;
	  
    DELETE from reporte_gastos WHERE idclub_fk = $1;
    
    DELETE from reporte_membresias WHERE club = $1;
    
    with asd as (select idvotacion from votaciones where club = $1)
    DELETE from preguntas_votacion WHERE id_votacion = (select idvotacion from asd);
    
    with asd as (select idvotacion from votaciones where club = $1)
    DELETE from archivos_votaciones WHERE idVotacion_fk = (select idvotacion from asd);
    
    with asd as (select idcomunicado from comunicado where club = $1)
    DELETE from archivos_comunicado WHERE idComunicado_fk = (select idcomunicado from asd);
    
    with asd as (select idcomunicado from comunicado where club = $1)
    DELETE from fotos_comunicado WHERE idfoto_fk = (select idcomunicado from asd);
    
    DELETE from comunicado WHERE club = $1;
    
    with asd as (select idevento from evento where club = $1)
    DELETE from foto_evento WHERE idEvento_fk = (select idEvento from asd);
    
    with asd as (select idevento from evento where club = $1)
    DELETE from recuento_acontecimientos WHERE idEvento = (select idEvento from asd);
    
    with asd as (select idevento from evento where club = $1)
    DELETE from puntos_evento WHERE idEvento_fk = (select idEvento from asd);
    
    with asd as (select idevento from evento where club = $1)
    DELETE from archivos_evento WHERE idEvento_fk = (select idEvento from asd);
    
    DELETE from evento WHERE club = $1;
    
    DELETE from colores_club WHERE idClub_fk = $1;
    
    with asd as (select idMembresia from miembro_club where idclub_fk = $1)
    DELETE from cargos WHERE idmiembro_fk = (select idMembresia from asd);
    
    DELETE from miembro_club WHERE idClub_fk = $1;
    
    DELETE from club WHERE idclub = $1;
      ;`

    client.query(
      query,
      [idclub],
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

const showClubClubFn = (req, res, client) => {
    const idclub = req.body.idclub;
  
    const queryStr = `
      select * from club 
      inner join direccion_club on direccion_club.idclub_fk = idclub 
      inner join colores_club on colores_club.idclub_fk = idclub 
      where idclub = $1
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

// idUser = all info of direccion_club, colores_club, club.

const showUserClubFn = (req, res, client) => {
    const user = req.body.idusuario;
  
    const queryStr = `
      select * from miembro_club
      INNER JOIN club on idclub = miembro_club.idclub_fk 
      INNER JOIN direccion_club on direccion_club.idclub_fk = miembro_club.idclub_fk
      INNER JOIN colores_club on colores_club.idclub_fk = miembro_club.idclub_fk and idusuario_fk = $1
      ;`
  
    client.query(
      queryStr,
      [user],
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
          res.send({ message: "" });
          console.log(result);
        }
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

// idUser = all info of direccion_club, colores_club, club.

const showClubListFn = (req, res, client) => {

  const queryStr = `
    select club.idclub, club.nombre as nombreClub, usuario.apodo from cargos
    INNER JOIN miembro_club on idmembresia = cargos.idmiembro_fk
    INNER JOIN usuario on miembro_club.idusuario_fk = usuario.idusuario
    INNER JOIN club on miembro_club.idclub_fk = idclub
    where cargos.cargo_fk = 1
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
        res.send({ message: "Lista de clubes" });
        console.log(result);
      }
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

// idUser = all info of direccion_club, colores_club, club.

const updateClubAddressFn = (req, res, client) => {
  const idclub = req.body.idclub;
  const logo = req.body.logo;
  const logo_ubicacion = req.logoUbicacion;
  const logo_nombre_club = req.body.logoNombreClub;

  const queryStr = `
        UPDATE colores_club
        SET logo = $1,
        logo_ubicacion = $2,
        logo_nombre_club = $3
        where idclub_fk = $4
      ;`

  client.query(
    queryStr,
    [logo, logo_ubicacion, logo_nombre_club, idclub],
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
        res.send({ message: "" });
        console.log(result);
      }
    }
  );
}


module.exports = { addClubFn, updateClubFn, deleteClubFn, showClubClubFn, showUserClubFn, showClubListFn, updateClubAddressFn }

////////////////////////////////////////////////////////////////////////////////////////////