////////////////////////////////////////////////////////////////////////////////////////////

//Motorcycle app, update, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

//Add user motorcycle

const addUserMotorcycleFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const placas = req.body.placas;
    const foto = req.body.foto;
    const tarjetaCirculacion = req.body.terjetaCirculacion;
    const idusuario = req.body.idusuario;
    
    const queryStr = `
        INSERT INTO motocicleta (marca, modelo, placas, foto, tarjetacirculacion, idusuario_fk)
        values ($1, $2, pgp_sym_encrypt( $3, $7), $4, pgp_sym_encrypt( $5, $7), $6)
        ;`
    
    client.query(
        queryStr,
        [marca, modelo, placas, foto, tarjetaCirculacion, idusuario, key],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se realizó el registro de la moto.' });
            return;
        }
            console.log('Fue realizado el registro de la moto.');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Update motorcycle info

const updateUserMotorcycleFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const placas = req.body.placas;
    const foto = req.body.foto;
    const tarjetaCirculacion = req.body.tarjetaCirculacion;
    const idusuario = req.body.idusuario;
    
    const queryStr = `
        UPDATE motocicleta
        SET marca = $1,
            modelo = $2,
            placas = pgp_sym_encrypt( $3, $7),
            foto = $4,
            tarjetacirculacion = pgp_sym_encrypt( $5, $7)
        WHERE idUsuario_fk = $6
        ;`
    
    client.query(
        queryStr,
        [marca, modelo, placas, foto, tarjetaCirculacion, idusuario, key],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se actualizó el registro' });
            return;
        }
            console.log('Datos actualizados. ');
            console.log(result)
            res.send({ created: true})
        }
    );
}

//////////////////////////////////////////////////////////////////////////////////////////// 

//Delete motorcycle

const deleteUserMotorcycleFn = (req, res, client) => {
    const idusuario = req.body.idusuario;
    
    const queryStr = `
        DELETE FROM motocicleta
        WHERE idusuario_fk = $1
        ;`
    
    client.query(
        queryStr,
        [idusuario],
        (err, result) => {
        if (err)
        {
            console.log(err);
            res.send({ error: 'No se borró la motocicleta' });
            return;
        }
            console.log('La motocicleta fue eliminada');
            console.log(result)
            res.send({ created: true})
        }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////

//Show motorcycle info

const showUserMotorcycleFn = (req, res, client) => {
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const idusuario = req.body.idusuario;

    const queryStr = `
        SELECT marca, modelo, pgp_sym_decrypt(placas::bytea, $2) as placas, foto, pgp_sym_decrypt(tarjetacirculacion::bytea, $2) as tarjetacirculacion from motorcycle
        WHERE idusuario_fk = $1
        ;`
  
    client.query(
      queryStr,
      [idusuario, key],
      (err, result) => {
      if (err)
      {
          console.log(err);
          res.send({ error: 'No se realizó la consulta' });
          return;
      }
      if (result.rows.length > 0)
      {
        res.send(result.rows[0]);
      }
      else
      {
        res.send({ message: "No hay registro de la moto" });
        console.log(result);
      }
    }
  );
}

module.exports = { addUserMotorcycleFn, updateUserMotorcycleFn, deleteUserMotorcycleFn, showUserMotorcycleFn }

////////////////////////////////////////////////////////////////////////////////////////////