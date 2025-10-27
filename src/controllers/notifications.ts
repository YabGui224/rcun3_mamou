import { Request, Response } from "express";
import { prisma } from "../script";
import { Notifications } from "../generated/prisma/client";

const getAllNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  const {id} = req?.params;

  await prisma.notifications.findMany({
    where: {
      userId: Number(id)
    },
    orderBy: {
        id: "desc"
    },
    include: { 
        user: {
            omit: {
                password:true
            }
        } 
    },
  })
  .then((notifications: Notifications[]) => {
    res.status(200).json({
      status: true,
      message: "Liste des notifications",
      data: notifications
    });
  })
  .catch((error: unknown) => {
    const err = error instanceof Error ? error : new Error("Erreur inconnue");
    res.status(500).json({
      status: false,
      message: `Erreur lors de la recuperation : ${err.message}`,
    });
  });
};

// const getNotificationById = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;

//   await prisma.notifications.findUnique({
//     where: { id: Number(id) },
//     include: { user: true },
//   })
//   .then((notifications: Notifications | null) => {
//     if (!notifications) {
//       return res.status(404).json({
//         status: false,
//         message: "Notification non trouvee",
//       });
//     }
//     res.status(200).json({
//       status: true,
//       data: notifications,
//     });
//   })
//   .catch((error: unknown) => {
//     const err = error instanceof Error ? error : new Error("Erreur inconnue");
//     res.status(500).json({
//       status: false,
//       message: `Erreur : ${err.message}`,
//     });
//   });
// };

const createNotification = async (userId:number, message:string): Promise<void> => {
    const data = {userId, message} as Notifications;

    await prisma.notifications.create({
        data: data
    })
    .then(() => {
        console.log("Notification creee avec succes");
    })
    .catch((error: unknown) => {
        const err = error instanceof Error ? error : new Error("Erreur inconnue");
        console.log("Erreur lors de l'envoi de la notification");
    });
};

const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await prisma.notifications.delete({
    where: { id: Number(id) },
  })
  .then(() => {
    res.status(200).json({
      status: true,
      message: "Notification supprimee avec succes",
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
    getAllNotificationsByUser,
    createNotification,
    deleteNotification
}