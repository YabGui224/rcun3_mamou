import express from 'express';
import { deleteUser, getAllUsers, getUser, resetPassword, updateUser } from '../controllers/users';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { profil } from '../controllers/login';

const userRoute = express.Router();

userRoute.put('/reset-password', resetPassword);
userRoute.put('/update/:id',[isAuthenticated], updateUser);
userRoute.delete('/delete/:id',[isAuthenticated], deleteUser);
userRoute.get('/:id',[isAuthenticated], getUser);
userRoute.get('/',[isAuthenticated], getAllUsers);
export default userRoute;
