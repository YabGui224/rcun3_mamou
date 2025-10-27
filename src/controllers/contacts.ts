import { Request, Response } from "express";
import { prisma } from "../script";
import { Contacts } from "../generated/prisma/client";
import { createNotification } from "./notifications";
import { getGreeting } from "../utils/utils";

const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  await prisma.contacts.findMany({
    include: { user: true },
  })
  .then((contacts: Contacts[]) => {
    res.status(200).json({
      status: true,
      message: "Liste des contacts",
      data: contacts,
    });
  })
  .catch((error: unknown) => {
    const err = error instanceof Error ? error : new Error("Erreur inconnue");
    res.status(500).json({
      status: false,
      message: `Erreur lors de la recuperation des contacts : ${err.message}`,
    });
  });
};

const getContactById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await prisma.contacts.findUnique({
    where: { id: Number(id) },
    include: { 
        user: {
            omit: {
                password:true
            }
        } 
    },
  })
  .then((contact: Contacts | null) => {
    if (!contact) {
      return res.status(404).json({
        status: false,
        message: "Contact non trouve",
      });
    }
    res.status(200).json({
      status: true,
      data: contact,
    });
  })
  .catch((error: unknown) => {
    const err = error instanceof Error ? error : new Error("Erreur inconnue");
    res.status(500).json({
      status: false,
      message: `Erreur : ${err.message}`,
    });
  });
};

const createContact = async (req: Request, res: Response): Promise<void> => {
    // recuperation du contenu de la requete
    const data = req.body as Contacts;

    // L'utilisateur qui cree le contact
    const user = await prisma.user.findUnique({
        where: {
            id: data.userId
        }
    });

    // L'utilisateur qu'on a ajoute le contact
    await prisma.user.findUnique({
        where: {
            tel: data.contact
        }
    })
        .then(async (destUser) => {
            if (destUser) {
                // la creation de nouveau contact
                await prisma.contacts.create({
                    data: data
                })
                    .then(async (contact: Contacts) => {
                        res.status(201).json({
                            status: true,
                            message: "Contact cree avec succes",
                            data: contact,
                        });
                    })
                    .catch((error: unknown) => {
                        const err = error instanceof Error ? error : new Error("Erreur inconnue");
                        res.status(500).json({
                            status: false,
                            message: `Erreur de creation : ${err.message}`,
                        });
                    });

            }
            else {
                res.status(500).json({
                    status: false,
                    message: `Erreur de creation : L'utilisateur avec le contact ${data.contact} n'existe pas encore donc vous ne pouvez pas l'ajouter dans votre liste de contact!`
                });
            }
            //personnalisation du message de salutation
            const greeting = getGreeting();
            const message = `${greeting} ${destUser?.nom} ${destUser?.prenom}, ${user?.nom} ${user?.prenom} vient de vous ajouter à ses contacts.`;
            // la creation de la notification
            await createNotification(Number(destUser?.id), message);
        })
        .catch((error: unknown) => {
            const err = error instanceof Error ? error : new Error("Erreur inconnue");
            
            res.status(500).json({
                status: false,
                message: `Erreur : ${err.message}`,
            });
        });

};

const updateContact = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as Contacts;

  await prisma.contacts.update({
    where: { id: Number(id) },
    data: data,
  })
  .then((updated: Contacts) => {
    res.status(200).json({
      status: true,
      message: "Contact mis a jour avec succes",
      data: updated,
    });
  })
  .catch((error: unknown) => {
    const err = error instanceof Error ? error : new Error("Erreur inconnue");
    if (err.message.includes("Record to update not found")) {
      res.status(404).json({
        status: false,
        message: "Contact non trouve",
      });
      return;
    }
    res.status(500).json({
      status: false,
      message: `Erreur de mise a jour : ${err.message}`,
    });
  });
};


const deleteContact = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await prisma.contacts.delete({
    where: { id: Number(id) },
  })
  .then(() => {
    res.status(200).json({
      status: true,
      message: "Contact supprime avec succes",
    });
  })
  .catch((error: unknown) => {
    const err = error instanceof Error ? error : new Error("Erreur inconnue");
    res.status(500).json({
      status: false,
      message: `Erreur de suppression : ${err.message}`,
    });
  });
};

export {
    getAllContacts,
    getContactById,
    createContact,
    deleteContact,
    updateContact

}