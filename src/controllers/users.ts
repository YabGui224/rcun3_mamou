import { ErrorRequestHandler, Request, Response } from "express";
import { prisma } from "../script";

const createUser = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const user = await prisma.user.create({
      data: data,
    });

    res.status(201).json({
      status: true,
      message: `Utilisateur ${data?.nom} ${data?.prenoms} ajoute avec succes !`,
      data: user,
    });
  } catch (error:any) {
    res.status(500).json({
      status: false,
      message: `Erreur lors de la creation de l'utilisateur : ${error.message}`,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const {id} = req.params;
  console.log({userId : id});
  
  const data = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: data
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
            contacts:true           
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
            contacts:true
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

export {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
}