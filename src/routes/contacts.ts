import express from 'express';
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from '../controllers/contacts';

const contactRoute = express.Router();

contactRoute.post('/', createContact);
contactRoute.put('/:id', updateContact);
contactRoute.delete('/:id', deleteContact);
contactRoute.get('/:id', getContactById);
contactRoute.get('/', getAllContacts);

export default contactRoute;
