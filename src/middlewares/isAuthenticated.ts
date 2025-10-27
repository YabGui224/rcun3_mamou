import { NextFunction, Request, Response } from "express";
import { getPayloadFromToken } from "../utils/utils";
import { prisma } from "../script";
import { User } from "../generated/prisma/client";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Vérifie la présence du header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }


    // Récupère le token depuis le header
    const token = authHeader.split(" ")[1];
    
    const payload = getPayloadFromToken(token);
    
    // Vérifie le contenu du payload
    if (!payload) {
      return res.status(401).json({ error: "Token invalide" });
    }

    if (payload === "Token expire") {
      return res.status(401).json({ error: "Token expiré, veuillez vous reconnecter" });
    }

    // Récupère l'utilisateur depuis la base
    const user = await prisma.user.findUnique({
      where: { tel: payload?.tel},
      omit: {password:true}
    });
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    
    // Injection de l'utilisateur dans la requête
    req.user = user as User;
    
    next();

  } catch (error: any) {
    console.error("Erreur middleware isAuthenticated:", error.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};