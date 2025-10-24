import express from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/users';

const userRoute = express.Router();

userRoute.post('/create', createUser);
userRoute.put('/update/:id', updateUser);
userRoute.delete('/delete/:id', deleteUser);
userRoute.get('/:id', getUser);
userRoute.get('/', getAllUsers);

export default userRoute;
