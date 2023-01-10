const fs = require('fs');
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

//id = idrepresentante

const uploadRepProfilePic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');//Solucion temporal al no borrar archivos
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/${id}-profilePic-${randStr}${fileExt}`;

  client.query(
    `SELECT fotoperfil FROM rep_empresa WHERE idrepresentate = $1;`,
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
              `UPDATE rep_empresa
                  SET fotoperfil = $1
                  WHERE idrepresentante = $2
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

//////////////////////////////////////////////////

const uploadPublicSpaceLogo = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');//Solucion temporal al no borrar archivos
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/Logo-${randStr}${fileExt}`;

  client.query(
    `SELECT logo FROM espacio_publico
    WHERE idrepresentate = $1
    ;`,
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
              `UPDATE espacio_publico
                  SET logo = $1
                  WHERE idrepresentante = $2
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

//////////////////////////////////////////////////

const uploadPublicSpacePic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/images/${id}/PublicPic-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("Se ha subido la imagen")

    client.query(
        `INSERT INTO foto_espacioP (idespacioP_fk, foto)
          VALUES ($2, $1)
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

//id = idproducto

const uploadProductPic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/sponsor/files/${id}/${id}-ProductPic-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("Se ha subido la imagen")

    client.query(
        `INSERT INTO foto_producto (idProducto_fk, foto)
          VALUES ($2, $1)
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

//////////////////////////////////////////////////////// - Usuario - ////////////////////////////////////////////////////////

const uploadProfilePic = (req, res, client) => {

  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/images/users/${id}/profile-${randStr}${fileExt}`;

  client.query(
    `SELECT fotoperfil FROM usuario WHERE idusuario = $1;`,
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
  )

}

//////////////////////////////////////////////////

const uploadMotorcyclePic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
      res.send("Hubo un problema");

  const file = req.files;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  let filepath = [];

  Object.entries(file).forEach(([key, value]) => {

      if(key == 'fotofront')
      {
          filepath.push(`${__dirname}/../files/users/images/${id}/motoF-${randStr}${fileExt}`);
          value.mv(`${__dirname}/../files/users/images/${id}/motoF-${randStr}${fileExt}`, (err) => console.log(err))
      }
      if(key == 'fototras')
      {
          filepath.push(`${__dirname}/../files/users/images/${id}/motoT-${randStr}${fileExt}`);
          value.mv(`${__dirname}/../files/users/images/${id}/motoT-${randStr}${fileExt}`, (err) => console.log(err))
      }
      if(key == 'fotoizq')
      {
          filepath.push(`${__dirname}/../files/users/images/${id}/motoI-${randStr}${fileExt}`);
          value.mv(`${__dirname}/../files/users/images/${id}/motoI-${randStr}${fileExt}`, (err) => console.log(err))

      }
      if(key == 'fotoder')
      {
          filepath.push(`${__dirname}/../files/users/images/${id}/motoD-${randStr}${fileExt}`);
          value.mv(`${__dirname}/../files/users/images/${id}/motoD-${randStr}${fileExt}`, (err) => console.log(err))

      }
  })

  let query = 'UPDATE motocicleta SET fotoFront = $1, fototras = $2, fotoizq = $3, fotoder = $4 WHERE idusuario_fk = $5; ';
  client.query(query, [filepath[0], filepath[1], filepath[2], filepath[3], id],
      (err, result) => {
          if (err)
          {
          res.send({message: "Ha habido un problema. Intente más tarde."})
          }
          else
          {
          res.send({message: "Se ha subido la imagen con éxito."})
          }
      });
}

//////////////////////////////////////////////////

const uploadProfileCompanionPic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');//Solucion temporal al no borrar archivos
  const fileExt = getFileExtension(file.name);

   const path =`${__dirname}/../files/users/images/${id}/profileC-${randStr}${fileExt}`;

  client.query(
    `SELECT fotoperfil FROM acompanante
        WHERE idusuario_fk = $1
    ;`,
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
                  WHERE idrepresentante = $2
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

//////////////////////////////////////////////////////// - EventoIndividual - ////////////////////////////////////////////////////////

//id = idevento_individual

const uploadIndividualRouteFile = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

   const path =`${__dirname}/../files/users/files/${id}/indRoute-${randStr}${fileExt}`;

   client.query(
    `SELECT ruta FROM evento_individual
        WHERE idevento_individual = $1
    ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old route deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("se ha subido la ruta")
      
          client.query(
              `UPDATE evento_individual
                  SET ruta = $1
                  WHERE idEvento_Individual = $2
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

//////////////////////////////////////////////////

const uploadIndividualPoster = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/users/images/${id}/indPoster-${randStr}${fileExt}`;

   client.query(
    `SELECT poster FROM evento_individual
        WHERE idevento_individual = $1
    ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old poster deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("se ha subido el nuevo poster")
      
          client.query(
              `UPDATE evento_individual
                  SET poster = $1
                  WHERE idEvento_Individual = $2
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

//////////////////////////////////////////////////////// - Acuerdo - ////////////////////////////////////////////////////////

//id = idAcuerdo

const uploadContractFile = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/club/files/${id}/contract-${id}-${randStr}${fileExt}`;

   client.query(
      `SELECT contrato FROM acuerdo
        WHERE idacuerdo = $1
      ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old covenant deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("Se ha subido el nuevo acuerdo")
      
          client.query(
              `UPDATE acuerdo
                  SET contrato = $1
                  WHERE idAcuerdo = $2
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

//////////////////////////////////////////////////

const uploadClubSpacePic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/club/files/${id}/pic-${id}-${idC}${fileExt}`;

   client.query(
      `SELECT imagen FROM espacio_club
        WHERE idacuerdo_fk = $1
      ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old photo deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("Se ha subido el nuevo acuerdo")
      
          client.query(
              `UPDATE espacio_club
                  SET imagen = $1
                  WHERE idAcuerdo_fk = $2
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

//////////////////////////////////////////////////////// - Foro - ////////////////////////////////////////////////////////

//id = idPublicacionForo

const uploadForumPic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/forum/images/${id}/forum-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("se ha subido la imagen")

    client.query(
        `UPDATE fotos_foro
            foto = $1,
            WHERE idpublicacionforo_fk = $2
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

const uploadForumFile = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/forum/files/${idC}/forum-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("se ha subido la imagen")

    client.query(
        `UPDATE archivos_foro
            archivo = $1,
            WHERE idpublicacionforo_fk = $2
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

//////////////////////////////////////////////////////// - Club - ////////////////////////////////////////////////////////

//id = idUsuario

const uploadColourLogoPic = (req, res, client) => { //const path =`${__dirname}/../files/club/images/${idC}/clubLogoPic-${randStr}${fileExt}`;
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

    const path =`${__dirname}/../files/club/files/${id}/pic-${id}-${idC}${fileExt}`;

   client.query(
      `SELECT logo FROM colores_club
        WHERE idClub_fk in (select idClub_fk from miembro_club where idusuario_fk = $1)
      ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old logo deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("Se ha subido el nuevo logo")
      
          client.query(
              `UPDATE Colores_club
                  SET logo = $1
                  WHERE idClub_fk = (select idClub_fk from miembro_club where idusuario_fk = $1)
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

//////////////////////////////////////////////////

const uploadColourLocationPic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/club/images/${idC}/clubLocationPic-${randStr}${fileExt}`;

  client.query(
      `SELECT ubiccacion FROM colores_club
        WHERE idClub_fk in (select idClub_fk from miembro_club where idusuario_fk = $1)
      ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old logo_ubicacion deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("Se ha subido el nuevo logo")
      
          client.query(
              `UPDATE Colores_club
                  SET ubicacion = $1
                  WHERE idClub_fk = (select idClub_fk from miembro_club where idusuario_fk = $1)
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

//////////////////////////////////////////////////

const uploadColourNamePic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/club/images/${idC}/clubNamePic-${randStr}${fileExt}`;

  client.query(
      `SELECT nombre_club FROM colores_club
        WHERE idClub_fk in (select idClub_fk from miembro_club where idusuario_fk = $1)
      ;`,
    [id],
    (err, result) => {
        try {
          fs.unlinkSync(result.rows[0].fotoperfil)
          console.log("Old nombre_club deleted");
        } catch (error) {
          console.log(error);
        }

        file.mv(path, (err) => {
          if (err)
          {
              return res.status(500).send(err);
          }
          console.log("Se ha subido el nuevo logo")
      
          client.query(
              `UPDATE Colores_club
                  SET nombre_club = $1
                  WHERE idClub_fk = (select idClub_fk from miembro_club where idusuario_fk = $1)
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

//////////////////////////////////////////////////

//id = idComunicado

const uploadStatementPic = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/club/images/${idC}/${idC}-statement-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("se ha subido la imagen")

    client.query(
        `UPDATE foto_comunicado
            foto = $1,
            WHERE idfoto_fk = $2
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

const uploadStatementFile = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/club/files/${idC}/${idC}-statement-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("se ha subido la imagen")

    client.query(
        `UPDATE archivos_comunicado
            archivo = $1,
            WHERE idcomunicado_fk = $2
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

const uploadMembersReportFile = (req, res, client) => {
  if(!req.session?.user || !req.session.user.idusuario)
    res.send("Hubo un problema");

  const file = req.files.image;
  const id = req.session.user.idusuario;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  const path =`${__dirname}/../files/club/files/${idC}/${idC}-ReportMembers-${randStr}${fileExt}`;

  file.mv(path, (err) => {
    if (err)
    {
        return res.status(500).send(err);
    }
    console.log("se ha subido la imagen")

    client.query(
        `UPDATE archivos_comunicado
            archivo = $1,
            WHERE idcomunicado_fk = $2
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

const uploadDemocraticProcessFile = (req, res, client) => { //const path =`${__dirname}/../files/club/files/${idC}/willOfThePeopleFile-${randStr}${fileExt}`;
  /*
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  
*/

}

//////////////////////////////////////////////////

const uploadExpensesReportFile = (req, res, client) => { //const path =`${__dirname}/../files/club/file/${idC}/expenses-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  
}

//////////////////////////////////////////////////////// - Evento - ////////////////////////////////////////////////////////

const uploadClubPosterPic = (req, res, client) => { // const path =`${__dirname}/../files/club/images/${idC}/posterClub-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  
  
}

//////////////////////////////////////////////////

const uploadClubRouteFile = (req, res, client) => { //const path =`${__dirname}/../files/club/file/${idC}/routePicClub-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  

}

//////////////////////////////////////////////////

const uploadClubEventFile= (req, res, client) => { //const path =`${__dirname}/../files/club/file/${idC}/routeFileClub-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  
}

//////////////////////////////////////////////////

const uploadClubEventExpencesFile = (req, res, client) => { //const path =`${__dirname}/../files/club/file/${idC}/expenses-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  

}

//////////////////////////////////////////////////

const uploadClubEventPic = (req, res, client) => { //const path =`${__dirname}/../files/club/images/${idC}/clubLogo-${randStr}${fileExt}`;
  const file = req.files.image;
  const idC = req.headers.id;
  const randStr = crypto.randomBytes(5).toString('hex');
  const fileExt = getFileExtension(file.name);

  

}

////////////////////////////////////////////////////////////////////////////////////////////

module.exports = { uploadRepProfilePic, uploadPublicSpaceLogo, uploadPublicSpacePic, uploadProductPic, uploadProfilePic, uploadMotorcyclePic, uploadProfileCompanionPic,
  uploadIndividualRouteFile, uploadIndividualPoster, uploadContractFile, uploadClubSpacePic, uploadForumPic, uploadForumFile, uploadColourLogoPic, uploadColourLocationPic, uploadColourNamePic,
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