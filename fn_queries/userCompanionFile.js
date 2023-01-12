////////////////////////////////////////////////////////////////////////////////////////////

//Companion add, update, delete, show || CompanionAllergy add, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

//Use this to register new companion

const addUserCompanionFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const idusuario = req.body.idusuario;
    const nombre = req.body.nombre;
    const ap = req.body.ap;
    const am = req.body.am;
    const apodo = req.body.apodo;
    const foto = req.files;
    const tiposangre = req.body.tipodesangre;
    const numerotelefonico = req.body.numerotelefonico;

    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/users/${idusuario}/images/profileCompa-${randStr}${fileExt}`;

    foto.mv(path, (err) => {
        if (err)
        {
            return res.status(500).send(err);
        }
        console.log("se ha subido la foto de perfil")})
    
    const queryStr = `
        INSERT into acompanate (idusuario_fk, nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico)
        values ($1, $2, pgp_sym_encrypt( $3, $9), pgp_sym_encrypt( $4, $9), $5, $6, pgp_sym_encrypt( $7, $9), pgp_sym_encrypt( $8, $9))
        ;`
    
    client.query(
        queryStr,
        [idusuario, nombre, ap, am, apodo, path, tiposangre, numerotelefonico, key],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue realizado el registro.' });
            return;
        }
        console.log('Fue realizado el registro del acompanante.');
        console.log(result)
        res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Alter companion data

const updateUserCompanionFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const usuario = req.body.idusuario;
    const nombre = req.body.nombre;
    const ap = req.body.ap;
    const am = req.body.am;
    const apodo = req.body.apodo;
    const fotoperfil = req.body.fotoperfil;
    const tipodesangre = req.body.tipodesangre;
    const numerotelefonico = req.body.numerotelefonico;
    
    const queryStr = `
        UPDATE acompanante
        SET nombre = $1,
            ap = pgp_sym_encrypt( $2, $9),
            am = pgp_sym_encrypt( $3, $9),
            apodo = $4,
            fotoperfil = $5,
            tipodesangre = pgp_sym_encrypt( $6, $9),
            numerotelefonico = pgp_sym_encrypt( $7, $9)
        WHERE idusuario_fk = $8
        ;`
    
    client.query(
        queryStr,
        [nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico, usuario, key],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'Ups' });
            return;
        }
            console.log('From verification: ');
            console.log(result)
            res.send({ created: true})
        }
    );
}

const updateProfilePicCompanion = (req, res, client) => {

    if(!req.session?.user || !req.session.user.idusuario)
      res.send("Hubo un problema");
  
    const file = req.files.image;
    const id = req.session.user.idusuario;
    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);
  
    const path =`${__dirname}/../files/images/users/${id}/profile-${randStr}${fileExt}`;
  
    client.query(
      `SELECT fotoperfil FROM acompanante WHERE idusuario_fk = $1;`,
      [id],
      (err, result) => {
          try {
            fs.unlinkSync(result.rows[0].fotoperfil)
            console.log("Old profile picture deleted");
          } catch (error) {
            console.log(error);
          }
  
          file.mv(path, (err) => {
              if (err)
              {
                  return res.status(500).send(err);
              }
              console.log("se ha subido la imagen")
        
              client.query(
                  `UPDATE acompanante
                      SET fotoperfil = $1
                      WHERE idusuario_fk = $2
                      ;`,
                  [path, id],
                  (err, result) => {
                    if (err)
                    {
                      res.send({message: "Ha habido un problema. Intente más tarde."})
                    }
                    else
                    {
                      res.send({message: "Se ha subido la imagen con éxito."})
                    }
                  }
                );
          });
  
      }
    )
  
  }

////////////////////////////////////////////////////////////////////////////////////////////

//Delete companion

const deleteUserCompanionFn = (req, res, client) => {
    const usuario = req.body.idusuario;

    client.query('SELECT fotoperfil FROM acompanante WHERE idusuario_fk = $1;',
        [usuario],
        (err, result) => {
            try {
              fs.unlinkSync(result.rows[0].fotoperfil)
              console.log("Old profile picture deleted");
            } catch (error) {
              console.log(error);
            }})
    
    const queryStr = `
        DELETE FROM A_PADECIMIENTOS
        WHERE idusuario_fk = $1;

        DELETE FROM acompanante
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue borrado el registro de acompanante' });
            return;
        }
            console.log('Borrado el registro de acompanante');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show all data from companion

const showUserCompanionFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const usuario = req.body.idusuario;
  
    const queryStr = `
        SELECT idusuario_fk, nombre,
        pgp_sym_decrypt(ap::bytea, $2) as ap
        pgp_sym_decrypt(am::bytea, $2) as am
        apodo, fotoperfil,
        pgp_sym_decrypt(tipodesangre::bytea, $2) as tipodesangre
        pgp_sym_decrypt(numerotelefonico::bytea, $2) as numerotelefonico from acompanante
        WHERE idusuario_fk = $1
        ;`
  
    client.query(
      queryStr,
      [usuario, key],
      (err, result) => {
      if (err)
      {
          console.log(err);
          res.send({ error: 'No se recuperaron los datos de la consulta' });
          return;
      }
      if (result.rows.length > 0)
      {
        res.send(result.rows[0]);
      }
      else
      {
        res.send({ message: "No hay acompanante registrado" });
        console.log(result);
      }
    }
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Add companion allergy

const addCompanionIllnessFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const padecimiento = req.body.padecimiento;
    const tipo = req.body.tipo; //1: enfermedad, 2: Alergia
    
    const queryStr = `
        INSERT INTO a_padecimientos (idusuario_fk, padecimiento, tipo)
        values ($1, $2, $3)
        ;`
    
    client.query(
        queryStr,
        [idusuario, padecimiento, tipo],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó el registro' });
            return;
        }
            console.log('Fue anadida el padecimiento del acompanante');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Delete companion allergy

const deleteCompanionIllnessFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    const padecimiento = req.body.padecimiento;
    
    const queryStr = `
        DELETE FROM a_padecimientos
        where idusuario_fk = $1 and padecimiento = $2
        ;`
    
    client.query(
        queryStr,
        [idusuario, padecimiento],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue borrada la enfermedad.' });
            return;
        }
            console.log('Se borró la enfermedad.');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show all allergies from companion

const showCompanionIllnessFn = (req, res, client) => {
    const usuario = req.body.usuario;
    
    const queryStr = `
        SELECT * FROM a_alergia
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [usuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se recuperaron los datos de la consulta.' });
            return;
        }
        if (result.rows.length > 0)
        {
            console.log('Lista de enfermedades');
            res.send(result.rows);
            }
        else
        {
            res.send({ message: "No hay registros de alergias de usuario" });
            console.log(result);
        }
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {
    addUserCompanionFn,
    updateUserCompanionFn,
    deleteUserCompanionFn,
    showUserCompanionFn,
    addCompanionIllnessFn,
    deleteCompanionIllnessFn,
    showCompanionIllnessFn
}

////////////////////////////////////////////////////////////////////////////////////////////