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
            return res.sendFile(pathObj.resolve(defaultPicturePath));
          else{

            if(result.rows.length < 1 || result.rows[0].fotoperfil.length < 2)
                return res.sendFile(pathObj.resolve(defaultPicturePath)); 
            else{
                const path = result.rows[0].fotoperfil;
                //console.log("Image path: ", path)
                return res.sendFile(pathObj.resolve(path), (err) => err && res.sendFile(pathObj.resolve(defaultPicturePath)));
            }
          }
      });
}

const getClubLogo = (req, res, client) => {
    const idclub = req.query.idclub;

    const query = `
      SELECT logo from colores_club WHERE idclub_fk = $1;
    `;

    client.query(
      query, 
      [idclub], 
      (err, result)=>{
          if(err)
            return;
          else{

            if(result.rows.length < 1 || result.rows[0].logo?.length < 2){
                return;
            }else{
                const path = result.rows[0].logo;
                //console.log("Logo path: ", path)
                res.sendFile(pathObj.resolve(path));
                return;
            }

          }
      });
}

const getClubLogoNombre = (req, res, client) => {
    const idclub = req.query.idclub;

    const query = `
      SELECT logo_nombre_club from colores_club WHERE idclub_fk = $1;
    `;

    client.query(
      query, 
      [idclub], 
      (err, result)=>{
          if(err)
            return;
          else{
            console.log(result)
            if(result.rows.length < 1 || result.rows[0].logo_nombre_club?.length < 2){
                return;
            }else{
           
                const path = result.rows[0].logo_nombre_club;
                //console.log("Logo path: ", path)
                res.sendFile(pathObj.resolve(path));

                return;
            }

          }
      });
}

const getClubLogoUbic = (req, res, client) => {
    const idclub = req.query.idclub;

    const query = `
      SELECT logo_ubicacion from colores_club WHERE idclub_fk = $1;
    `;

    client.query(
      query, 
      [idclub], 
      (err, result)=>{
          if(err)
            return;
          else{

            if(result.rows.length < 1 || result.rows[0].logo_ubicacion.length < 2){
                return;
            }else{
                const path = result.rows[0].logo_ubicacion;
                //console.log("Logo path: ", path)
                res.sendFile(pathObj.resolve(path));
                return;
            }

          }
      });
}

const downloadTest = (req, res, client) => {
    
    const testPath = `${__dirname}/../files/test.xlsx`;

    try {
        
        return res.download(pathObj.resolve(testPath), "reglamento"+getFileExtension(testPath)); 
    } catch (error) {
        
    }

}

function getFileExtension(name){
    try {
        let ext = name.match(/\.[^.]+$/gmi);

        return ext === null ? null : ext[0];
    } catch {
        return name;
    }
}
//Santo Grial
const printGeneralFileFn = (req, res, client) => {
  if(!req.session?.user)
  res.send("Hubo un problema con la sesion");
    const dirFILE = req.query.dirFILE;
    const path = `${dirFILE}`;
    
    return res.sendFile(pathObj.resolve(path), (err) => err && console.log("Se perdió la respuesta en el camino"));
}
//Santo Grial

module.exports = { 
    getProfilePic, 
    getClubLogo,
    getClubLogoNombre,
    getClubLogoUbic, 
    downloadTest,
    printGeneralFileFn
  }