import {z} from 'zod';

export const userSchema = z.object({
    nom : z.string({error: "le nom est obligatoire"}),
    prenom : z.string({error: "le prenom est obligatoire"}),
    tel : z.string("Le tel est obligatoire")
            .length(9, {error: "La taille du tel doit etre 9 chiffre"})
            .regex(/^6[1256]\d{7}$/, {
                message: "Le numero doit commencer par 6 suivi de 1, 2, 5 ou 6 et contenir 9 chiffres au total (ex: 621xxxxxx)",
            }),
}).required({
    nom : true,
    prenom: true,
    tel: true
});

// schema(validation des champs) de modification du mot de passe
export const updatePasswordSchema = z.object({
    password : z.string({error: "le nouveau mot de passe est obligatoire"}),
    oldPassword : z.string({error: "l'ancien  mot de passe est obligatoire"})
}).required({
    oldPassword : true, // ancien mot de passe
    password : true, // nouveau mot de passe
});

export const idSchema = z.object({
    id : z.number({error: "l'ID doit etre un chiffre"})
}).required({
    id : true
});

// resetPassword schema
export const resetPasswordSchema = z.object({
    email : z.email({error: "l'adresse email est obligatoire"}),
    newPassword : z.string({error: "le nouveau mot de passe est obligatoire"})
                    .min(5, "Mot de passe trop faible, taille min = 5")
}).required({
    email : true, // ancien mot de passe
    newPassword : true, // nouveau mot de passe
});

// schema pour le login
export const loginSchema = z.object({
    tel : z.string("Le tel est obligatoire")
            .length(9, {error: "La taille du tel doit etre 9 chiffre"})
            .regex(/^6[1256]\d{7}$/, {
                message: "Le numero doit commencer par 6 suivi de 1, 2, 5 ou 6 et contenir 9 chiffres au total (ex: 621xxxxxx)",
            }),
    password : z.string({error: "le mot de passe est obligatoire"})
}).required({
    tel : true, // ancien mot de passe
    password : true, // nouveau mot de passe
});