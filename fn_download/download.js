const pathObj = require('path');


const getProfilePic = (req, res, client) => {
    const idusuario = req.query.idusuario;
    const defaultPicturePath = `${__dirname}/../files/images/users/defaultProfilePic.webp`;
    const query = `
      SELECT fotoperfil from usuario WHERE idusuario = $1;
    `;

    client.query(
      query, 
      [idusuario], 
      (err, result)=>{
          if(err)
            res.sendFile(pathObj.resolve(defaultPicturePath));
          else{

            if(result.rows.length < 1 || result.rows[0].fotoperfil.length < 2)
                return res.sendFile(pathObj.resolve(defaultPicturePath)); 

            const path = result.rows[0].fotoperfil;
            console.log("Image path: ", path)
            return res.sendFile(pathObj.resolve(path));
          }
      });
}

function getFileExtension (name){
    try {
        let ext = name.match(/\.[^.]+$/gmi);

        return ext === null ? null : ext[0];
    } catch {
        return name;
    }
}

module.exports = { getProfilePic }