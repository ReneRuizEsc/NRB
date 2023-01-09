const crypto = require("crypto");

function getFileExtension (name){
  try {
      let ext = name.match(/\.[^.]+$/gmi);

      return ext === null ? null : ext[0];
  } catch {
      return name;
  }
}

//////////////////////////////////////////////////////// - Patrocinador - ////////////////////////////////////////////////////////

const uploadRepProfilePic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id; //idRepresentante
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/${id}-profilePic${fileExt}`;

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
            //
          }
          else
          {
            console.log(result);
          }
        }
      );
    return res.send({ message: "La imagen se ha subido con éxito." });
});
  
}

//////////////////////////////////////////////////

const uploadPublicSpaceLogo = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/Logo${fileExt}`;

}

//////////////////////////////////////////////////

const uploadPublicSpacePic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/PublicPic-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadProductPic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/files/${id}/${id}-ProductPic-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////////// - Usuario - ////////////////////////////////////////////////////////

const uploadProfilePic = (req, res, client) => {

  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/images/users/${id}/profile-${randStr}${fileExt}`;

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

//////////////////////////////////////////////////

const uploadCredentialPicF = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/credential-F-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadCredentialPicB = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/credential-B-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////

const uploadFacePic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/face-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////

const uploadMotorcyclePicF = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/motoF-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadMotorcyclePicB = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/motoB-${randStr}${fileExt}`;
  
}

//////////////////////////////////////////////////

const uploadMotorcyclePicI = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/motoI-${randStr}${fileExt}`;
  
}

//////////////////////////////////////////////////

const uploadMotorcyclePicD = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/motoB-${randStr}${fileExt}`;
  
}

//////////////////////////////////////////////////

const uploadProfileCompanionPic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/profileC-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////////// - EventoIndividual - ////////////////////////////////////////////////////////

const uploadIndividualRouteFile = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${id}/indRoute-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////

const uploadIndividualPoster = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/indPoster-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////////// - Acuerdo - ////////////////////////////////////////////////////////

const uploadContractFile = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const idC = req.headers.idC;
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${id}/contract-${id}-${idC}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadClubSpacePic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const idC = req.headers.idC;
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${id}/pic-${id}-${idC}${fileExt}`;
}

//////////////////////////////////////////////////////// - Foro - ////////////////////////////////////////////////////////

const uploadForumPic = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${id}/forum-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadForumFile = (req, res, client) => {
  const file = req.files.image;
  const id = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${id}/forum-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////////// - Club - ////////////////////////////////////////////////////////

const uploadColourLogoPic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/clubLogoPic-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadColourLocationPic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/clubLocationPic-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadColourNamePic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/clubNamePic-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadStatementPic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/${idC}-statement-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadStatementFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${idC}/${idC}-statement-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////

const uploadMembersReportFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${idC}/${idC}-ReportMembers-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadDemocraticProcessFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/files/${idC}/willOfThePeopleFile-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadExpensesReportFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/file/${idC}/expenses-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////////// - Evento - ////////////////////////////////////////////////////////

const uploadClubPosterPic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/posterClub-${randStr}${fileExt}`;
  
}

//////////////////////////////////////////////////

const uploadClubRouteFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/file/${idC}/routePicClub-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadClubEventFile= (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/file/${idC}/routeFileClub-${randStr}${fileExt}`;
}

//////////////////////////////////////////////////

const uploadClubEventExpencesFile = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/file/${idC}/expenses-${randStr}${fileExt}`;

}

//////////////////////////////////////////////////

const uploadClubEventPic = (req, res, client) => {
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/users/images/${idC}/clubLogo-${randStr}${fileExt}`;

}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { uploadRepProfilePic, uploadPublicSpaceLogo, uploadPublicSpacePic, uploadProductPic, uploadProfilePic, uploadCredentialPicF, uploadCredentialPicB, uploadMotorcyclePicI, uploadMotorcyclePicD, uploadFacePic, uploadMotorcyclePicF,
  uploadMotorcyclePicB, uploadProfileCompanionPic, uploadIndividualRouteFile, uploadIndividualPoster, uploadContractFile, uploadClubSpacePic, uploadForumPic, uploadForumFile, uploadColourLogoPic, uploadColourLocationPic, uploadColourNamePic,
  uploadStatementPic, uploadStatementFile, uploadMembersReportFile, uploadDemocraticProcessFile, uploadExpensesReportFile, uploadClubPosterPic, uploadClubRouteFile, uploadClubEventFile, uploadClubEventExpencesFile, uploadClubEventPic }

////////////////////////////////////////////////////////////////////////////////////////////

//⣿⣿⣿⣿⣿⠟⠋⠄⠄⠄⠄⠄⠄⠄⢁⠈⢻⢿⣿⣿⣿⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⠃⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⡀⠭⢿⣿⣿⣿⣿
//⣿⣿⣿⣿⡟⠄⢀⣾⣿⣿⣿⣷⣶⣿⣷⣶⣶⡆⠄⠄⠄⣿⣿⣿⣿
//⣿⣿⣿⣿⡇⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠄⠄⢸⣿⣿⣿⣿
//⣿⣿⣿⣿⣇⣼⣿⣿⠿⠶⠙⣿⡟⠡⣴⣿⣽⣿⣧⠄⢸⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⣾⣿⣿⣟⣭⣾⣿⣷⣶⣶⣴⣶⣿⣿⢄⣿⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⣿⣿⣿⡟⣩⣿⣿⣿⡏⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⣿⣹⡋⠘⠷⣦⣀⣠⡶⠁⠈⠁⠄⣿⣿⣿⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⣿⣍⠃⣴⣶⡔⠒⠄⣠⢀⠄⠄⠄⡨⣿⣿⣿⣿⣿⣿
//⣿⣿⣿⣿⣿⣿⣿⣦⡘⠿⣷⣿⠿⠟⠃⠄⠄⣠⡇⠈⠻⣿⣿⣿⣿
//⣿⣿⣿⣿⡿⠟⠋⢁⣷⣠⠄⠄⠄⠄⣀⣠⣾⡟⠄⠄⠄⠄⠉⠙⠻
//⡿⠟⠋⠁⠄⠄⠄⢸⣿⣿⡯⢓⣴⣾⣿⣿⡟⠄⠄⠄⠄⠄⠄⠄⠄
//⠄⠄⠄⠄⠄⠄⠄⣿⡟⣷⠄⠹⣿⣿⣿⡿⠁⠄⠄⠄⠄⠄⠄⠄⠄
//⣿⣿⣿⣿⠄APROVED BY THE CCP⠄⣿⣿⣿⣿⣿⣿