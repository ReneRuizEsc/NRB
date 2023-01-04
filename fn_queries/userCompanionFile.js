////////////////////////////////////////////////////////////////////////////////////////////

//Companion add, update, delete, show || CompanionAllergy add, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

//Use this to register new companion

const addUserCompanionFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    const nombre = req.body.nombre;
    const ap = req.body.ap;
    const am = req.body.am;
    const apodo = req.body.apodo;
    const fotoperfil = req.body.fotoperfil;
    const tiposangre = req.body.tipodesangre;
    const numerotelefonico = req.body.numerotelefonico;
    
    const queryStr = `
        INSERT into acompanate (idusuario_fk, nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        ;`
    
    client.query(
        queryStr,
        [usuario, nombre, ap, am, apodo, fotoperfil, tiposangre, numerotelefonico],
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
            ap = $2,
            am = $3,
            apodo = $4,
            fotoperfil = $5,
            tipodesangre = $6,
            numerotelefonico = $7
        WHERE idusuario_fk = $8
        ;`
    
    client.query(
        queryStr,
        [nombre, ap, am, apodo, fotoperfil, tipodesangre, numerotelefonico, usuario],
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

////////////////////////////////////////////////////////////////////////////////////////////

//Delete companion

const deleteUserCompanionFn = (req, res, client) => {
    const usuario = req.body.idusuario;
    
    const queryStr = `
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
  const usuario = req.body.idusuario;
  
  const queryStr = `
        SELECT * from acompanante
        WHERE idusuario_fk = $1
        ;`
  
  client.query(
      queryStr,
      [usuario],
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

const addCompanionAllergyFn = (req, res, client) => {
    const usuario = req.body.usuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
        INSERT INTO a_alergia (idusuario_fk, alergia)
        values ($1, $2)
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó la consulta' });
            return;
        }
            console.log('Fue anadida la alergia del acompanante');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Delete companion allergy

const deleteCompanionAllergyFn = (req, res, client) => {
    const usuario = req.body.usuario;
    const alergia = req.body.alergia;
    
    const queryStr = `
        DELETE FROM a_alergia
        where idusuario_fk = $1 and alergia = $2
        ;`
    
    client.query(
        queryStr,
        [usuario, alergia],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No fue borrada la alergia.' });
            return;
        }
            console.log('Se borró la alergia.');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show all allergies from companion

const showCompanionAllergyFn = (req, res, client) => {
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
            res.send(result.rows[0]);
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

module.exports = { addUserCompanionFn, updateUserCompanionFn, deleteUserCompanionFn, showUserCompanionFn, addCompanionAllergyFn, deleteCompanionAllergyFn, showCompanionAllergyFn }

////////////////////////////////////////////////////////////////////////////////////////////