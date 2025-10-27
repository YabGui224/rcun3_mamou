import { Request, Response } from "express";
import { prisma, redisClient } from "../script";
import { idSchema, resetPasswordSchema, updatePasswordSchema, userSchema } from "../schemas/users_schema";
import z from "zod";
import { cryptedPassword, decryptPassword, generateOTP, tokenify } from "../utils/utils";
import { sendMail } from "../utils/mailer";

const createUser = async (req: Request, res: Response) => {
    
    try {
        // controle de la validation des champs
        userSchema.parse(req.body);
        
        const data = req.body;
        const hash = await cryptedPassword(data?.password);
        const user = await prisma.user.create({
        data: {
            ...data,
            password: hash
        },
        omit: {
            password:true
        }
        });
        const paylaod = { tel: user.tel };
        const token = tokenify(paylaod, "token");
        const refreshToken = tokenify(paylaod, "refresh");        

        res.status(201).json({
        status: true,
        message: null,
        data: {token, refreshToken},
        });
  } catch (error:any) {
    if ( error instanceof  z.ZodError) {
        res.status(400).json({
          status: false,
          errors:  error.issues,
        });
    } else {
        res.status(500).json({
          status: false,
          message: `Erreur lors de la creation de l'utilisateur : ${error.message}`,
        });
    }
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {id} = req.params;
   
  const data = req.body;

  try {
    const hash = await cryptedPassword(data?.password);
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...data,
        password:hash 
      },
      omit: {
        password:true
      }
    });

    res.status(201).json({
      status: true,
      message: 'Utilisateur modifie succes',
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: `Erreur de mise a jour : ${error.message}`,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id)
        }
    });
    
    if (user) {
        await prisma.user.delete({
            where: {
                id : user.id
            }
        })
        .then((user) => {
            res.status(201).json({
                status : true,
                message: "Utilisateur supprime avec success"
            });
        })
        .catch((error) => {
            res.status(500).json({
                status : false,
                message: `Erreur de suppression de l'utilisateur : ${error}`
            });
        });
    } else {
        res.status(500).json({
            status : false,
            message: "Cet t'utilisateur n'existe pas"
        });
    }
}

const getUser = async (req: Request, res: Response) => {
    const {id} = req.params;

    await prisma.user.findUnique({
        where: {
            id : Number(id),
        },
        include: {
            contacts:true,           
            notifications:true
        },
        omit: {
            password:true
        }
    })
    .then((user) => {
            res.status(201).json({
                status : true,
                message: "Utilisateur",
                data: user
            });
        })
        .catch((error) => {
            res.status(500).json({
                status : false,
                message: error
            });
        });
}

const getAllUsers = async (req: Request, res: Response) => {    
    await prisma.user.findMany({
        include: {
            contacts:true,
            notifications:true
        },
        omit: {
            password:true
        }
    })
    .then((users) => {
            res.status(201).json({
                status : true,
                message: "Utilisateurs",
                data: users
            });
        })
        .catch((error) => {
            res.status(500).json({
                status : false,
                message: error
            });
        });
}

// modification du password
const updatePassword = async (req: Request, res: Response) => {
    try {
        // validation des donnees provenant du body de la requete
        updatePasswordSchema.parse(req?.body);
        // verification de l'ID
        const {id} = req?.params;
        const parsedID = Number(id);
        idSchema.parse(parsedID);
        
        const data = req.body;
        // recherche de l'utilisateur en fonction de son ID
        await prisma.user.findUnique({
            where:{
                id: parsedID
            }
        })
        .then(async (user) => {
            if (user) {
                if (await decryptPassword(data?.oldPassword, user.password )) {
                    const newPasswordHashed = await cryptedPassword(data?.password);
                    await prisma.user.update({
                        where : {
                            id: parsedID
                        },
                        data: {
                            password: newPasswordHashed
                        }
                    })
                    .then((_) => {
                        res.status(201).json({
                            status: true,
                            message: "Mot de passe modifier avec success!!"
                        });
                    })
                }else {
                    res.status(200).json({
                        status: true,
                        message: "Mot de passe incorect!!"
                    });
                }
            } else {
                res.status(200).json({
                    status: true,
                    message: "User not found!!!"
                });
            }
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                status: false,
                errors: error.issues,
            });
        }
    } 

}


// reinitilisation du password sans envoyer de mail : cette methode est manuelle 
const resetPassword = async (req: Request, res: Response) => {
    try {
        // validation des donnees provenant du body de la requete
        resetPasswordSchema.parse(req?.body);
        const data = req.body;
        // recherche de l'utilisateur en fonction de son ID
        await prisma.user.findUnique({
            where:{
                email: data?.email
            }
        })
        .then(async (user) => {
            if (user) {
                 const newPasswordHashed = await cryptedPassword(data?.newPassword);
                    await prisma.user.update({
                        where : {
                            email: data?.email
                        },
                        data: {
                            password: newPasswordHashed
                        }
                    })
                    .then((_) => {
                        res.status(201).json({
                            status: true,
                            message: "Mot de passe modifier avec success!!"
                        });
                    })
            } else {
                res.status(200).json({
                    status: true,
                    message: "User not found!!!"
                });
            }
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                status: false,
                errors: error.issues,
            });
        }
    } 

}

// envoyer un mail contenant le Otp pour l'initialisation du mot de passe
const resetPasswordWithEmail = async (req: Request, res: Response) => {
    console.log(req.body?.email);
    
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const otp = generateOTP();

    // Stocke OTP dans Redis avec expiration de 5 minutes
    await redisClient.set(`otp:${email}`, otp, "EX", 5 * 60);
    const html = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Bonjour ${user.nom} ${user.prenom},</h2>
            <p>Voici votre code <strong>OTP</strong> pour réinitialiser votre mot de passe :</p>
            <div style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #4CAF50; display: inline-block; padding: 10px 20px; border-radius: 5px; margin: 15px 0;">
                ${otp}
            </div>
            <p style="color: #555;">Ce code est valable <strong>5 minutes</strong>.</p>
            <p style="font-size: 12px; color: #888;">Si vous n'avez pas demandé de réinitialisation, ignorez ce message.</p>
        </div>
    `;

    // Envoie mail
    await sendMail(
      user.email, 
      "Votre code OTP", 
      html
    );

    res.status(200).json({ status: true, message: "OTP envoyé par mail" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Erreur serveur" });
  }
};

// verifier le Otp et Reinitialiser le Password
export const verifyOtpAndResetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ error: "OTP invalide ou expiré" });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await cryptedPassword(newPassword);

    // Mise à jour de l'utilisateur
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Supprimer l’OTP de Redis après utilisation
    await redisClient.del(`otp:${email}`);

    res.status(200).json({ status: true, message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Erreur serveur" });
  }
};

export {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    updatePassword,
    resetPassword,
    resetPasswordWithEmail

}