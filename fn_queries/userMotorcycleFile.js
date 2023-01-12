////////////////////////////////////////////////////////////////////////////////////////////

//Motorcycle app, update, delete, show

////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const crypto = require("crypto");
const pathObj = require('path');
const { getFileExtension } = require("../generalFn/generalFn");

//Add user motorcycle

const addUserMotorcycleFn = (req, res, client) => {
if(!req.session?.user || !req.session.user.idusuario)
        res.send("Hubo un problema");
    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const placas = req.body.placas;
    const foto = req.files;
    const tarjetaCirculacion = req.body.terjetaCirculacion;
    const idusuario = req.body.idusuario;

    const randStr = crypto.randomBytes(5).toString('hex');
    let fileExt;
    let file1 = '';
    let file2 = '';
    let file3 = '';
    let file4 = '';

    Object.entries(foto).forEach(([key, value]) => {
        fileExt = getFileExtension(value.name);
  
          if(key == 'fotofront')
          {
              file1 = `${__dirname}/../files/users/${id}/images/moto1-${randStr}${fileExt}`;
              value.mv(`${__dirname}/../files/users/${id}/images/moto1-${randStr}${fileExt}`, (err) => console.log(err))
          }
          if(key == 'fototras')
          {
  
            file2 = `${__dirname}/../files/users/${id}/images/moto2-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/moto2-${randStr}${fileExt}`, (err) => console.log(err))
          }
          if(key == 'fotoizq')
          {
            file3 = `${__dirname}/../files/users/${id}/images/moto3-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/moto3-${randStr}${fileExt}`, (err) => console.log(err))
  
          }
          if(key == 'fotoder')
          {
            file4 = `${__dirname}/../files/users/${id}/images/moto4-${randStr}${fileExt}`;
              value.mv(`${__dirname}/../files/users/${id}/images/moto4-${randStr}${fileExt}`, (err) => console.log(err))
          }
      })
    
    const queryStr = `
        INSERT INTO motocicleta (marca, modelo, placas, tarjetacirculacion, idusuario_fk, fotofront, fototras, fotoizq, fotoder)
        values ($1, $2, pgp_sym_encrypt( $3, $7), pgp_sym_encrypt( $4, $7), $5, $6, $7, $8, $9)
        ;`
    
    client.query(
        queryStr,
        [marca, modelo, placas, tarjetaCirculacion, idusuario, key, file1, file2, file3, file4],
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

const updateUserMotorcycleFn = (req, res, client) => { //DEBE SUBIR LAS 4 FOTOS PD. NO SE BORRAN LAS FOTOS
    if(!req.session?.user || !req.session.user.idusuario)
        res.send("Hubo un problema");

    const key = 'QxiE+JMOl7PTGP8rDIwhew==';
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const placas = req.body.placas;
    const foto = req.files;
    const tarjetaCirculacion = req.body.tarjetaCirculacion;
    const idusuario = req.body.idusuario;

    const randStr = crypto.randomBytes(5).toString('hex');
    let fileExt;
    
    let file1 = '';
    let file2 = '';
    let file3 = '';
    let file4 = '';

    Object.entries(foto).forEach(([key, value]) => {
        fileExt = getFileExtension(value.name);
  
          if(key == 'fotofront')
          {
              file1 = `${__dirname}/../files/users/${id}/images/moto1-${randStr}${fileExt}`;
              value.mv(`${__dirname}/../files/users/${id}/images/moto1-${randStr}${fileExt}`, (err) => console.log(err))
          }
          if(key == 'fototras')
          {
  
            file2 = `${__dirname}/../files/users/${id}/images/moto2-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/moto2-${randStr}${fileExt}`, (err) => console.log(err))
          }
          if(key == 'fotoizq')
          {
            file3 = `${__dirname}/../files/users/${id}/images/moto3-${randStr}${fileExt}`;
            value.mv(`${__dirname}/../files/users/${id}/images/moto3-${randStr}${fileExt}`, (err) => console.log(err))
  
          }
          if(key == 'fotoder')
          {
            file4 = `${__dirname}/../files/users/${id}/images/moto4-${randStr}${fileExt}`;
              value.mv(`${__dirname}/../files/users/${id}/images/moto4-${randStr}${fileExt}`, (err) => console.log(err))
          }
      })
    
    const queryStr = `
        UPDATE motocicleta
        SET marca = $1,
            modelo = $2,
            placas = pgp_sym_encrypt( $3, $7),
            fotofront = $5,
            fototras = $6,
            fotoizq = $7,
            fotoder = $8,
            tarjetacirculacion = pgp_sym_encrypt( $9, $7)
        WHERE idUsuario_fk = $6
        ;`
    
    client.query(
        queryStr,
        [marca, modelo, placas, file1, file2, file3, file4 , tarjetaCirculacion, idusuario, key],
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

    client.query(`SELECT fotofront, fototras, fotoizq, fotoder FROM motocicleta WHERE idusuario_fk = $1;`,
        [idusuario],
        (err, result) => {
            try {
              fs.unlinkSync(result.rows[0].fotofront);
              fs.unlinkSync(result.rows[0].fototras);
              fs.unlinkSync(result.rows[0].fotoizq);
              fs.unlinkSync(result.rows[0].fotoder);
              console.log("Old pictures deleted");
            } catch (error) {
              console.log(error);
            }
          })
    
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
        SELECT marca, modelo, pgp_sym_decrypt(placas::bytea, $2) as placas, fotofront, fototras, fotoizq, fotoder, pgp_sym_decrypt(tarjetacirculacion::bytea, $2) as tarjetacirculacion from motocicleta
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