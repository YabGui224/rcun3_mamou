import { Request, Response } from "express";
import { prisma } from "../script";
import { decryptPassword, getPayloadFromToken, tokenify } from "../utils/utils";
import { loginSchema } from "../schemas/users_schema";
import z from "zod";

// Se connecter
export const login = async (req: Request, res: Response) => {
    try {
        // validation des champs
        loginSchema.parse(req?.body);

        // recuperation des credentials (tel et password)
        const { tel, password }: { tel: string, password: string } = req.body;

        // recherche de l'utilisateur en fonction de son tel
        await prisma.user.findUnique({
            where: {
                tel: tel
            }
        })
            .then(async (user) => {
                if (user && (await decryptPassword(password, user.password))) {
                    const paylaod = { tel: user.tel };
                    const token = tokenify(paylaod, "token");
                    const refreshToken = tokenify(paylaod, "refresh");

                    res.status(200).json({
                        status: true,
                        message: null,
                        data: { token, refreshToken }
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        message: "Wrong credentials",
                        token: null
                    });
                }
            });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(500).json({
                status: false,
                error: error.issues,
                token: null
            });
        } else {
            res.status(500).json({
                status: false,
                error: error,
                token: null
            });
        }
    }
}

// Se deconnecter
export const logout = async (req: Request, res: Response) => {
    // supprimer la cle user sur l'object req de express revient a lui deconnecte
    req.user = undefined;
    res.status(200).json({
        status: true,
        message: "Logged out",
    });
}

// Actualiser le token pour ne pas oblige l'utilisateur a s'authentifier chaque fois
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body?.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token manquant" });
    }

    // Vérifier la validité du refresh token
    const payload = getPayloadFromToken(refreshToken, true);
    // Vérifie le contenu du payload
    // Vérifie le contenu du payload
    if (!payload) {
      return res.status(401).json({ error: "Refresh Token invalide" });
    }

    if (payload === "Token expire") {
      return res.status(401).json({ error: "Refresh Token expiré, veuillez vous reconnecter" });
    }

    // Récupère l'utilisateur depuis la base
    const user = await prisma.user.findUnique({
      where: { tel: payload?.tel },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Générer un nouveau access token
    const newToken = tokenify({ tel: user.tel}, "token");

    res.status(200).json({
      status: true,
      message: "Token régénéré avec succès",
      data: { token: newToken },
    });
  } catch (error) {
    console.error("Erreur refresh:", error);
    res.status(500).json({
      status: false,
      message: "Erreur lors du rafraîchissement du token",
    });
  }
};

// recuperer les infos de profil de l'utilisateur connecter
export const profil = (req: Request, res: Response) => {
    console.log(req.user); //verification
    try {
        const user = req.user;
        res.status(200)
            .json({user: user});
    } catch (error) {
        console.log(req);
        res.status(500).json({error : error});
    }
}