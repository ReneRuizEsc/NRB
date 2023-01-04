const crypto = require("crypto");

const uploadProfilePic = (req, res, client) => {
    const file = req.files.image;
    const id = req.headers.id;
    console.log(req.params)
    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/files/images/users/${id}/profile-${randStr}${fileExt}`;

    file.mv(path, (err) => {
        if (err)
        {
            return res.status(500).send(err);
        }
        console.log("se ha subido la imagen")
        
        client.query(
            `UPDATE Usuario
                SET fotoperfil = $1
                WHERE idusuario = $2
                ;`,
            [path, id],
            (err, result) => {
              if (err)
              {
                res.send({ error: 'No fue actualizada la foto' });
              }
              else
              {
                console.log(result);
                res.send({ message: "Actualización exitosa de foto." });
              }
            }
          );
        return res.send({ message: "La imagen se ha subido con éxito." });
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

module.exports = { uploadProfilePic }