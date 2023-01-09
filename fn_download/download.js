const pathObj = require('path');


const getProfilePic = (req, res, client) => {
    const idusuario = req.query.idusuario;
  
    const query = `
      SELECT fotoperfil from usuario WHERE idusuario = $1;
    `;

    client.query(
      query, 
      [idusuario], 
      (err, result)=>{
          if(err)
            res.send("");
          else{

            if(result.rows.length < 1)
              res.send("");

            const path = result.rows[0].fotoperfil;
            console.log("Image path: ", path)
            res.sendFile(pathObj.resolve(path));
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