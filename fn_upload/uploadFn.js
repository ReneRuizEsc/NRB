const crypto = require("crypto");

const uploadProfilePic = (req, res) => {
    const file = req.files.image;
    const id = req.headers.id;
    console.log(req.params)
    const randStr = crypto.randomBytes(5).toString('hex');
    const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/files/images/users/${id}/profile-${randStr}${fileExt}`;

    file.mv(path, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("se ha subido la imagen")
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

module.exports = {
    uploadProfilePic
}