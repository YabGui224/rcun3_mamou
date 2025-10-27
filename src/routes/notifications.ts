import express from 'express';
import { deleteNotification, getAllNotificationsByUser } from '../controllers/notifications';

const notificationRoute = express.Router();

notificationRoute.delete('/:id', deleteNotification);
notificationRoute.get('/:id', getAllNotificationsByUser);

export default notificationRoute;
