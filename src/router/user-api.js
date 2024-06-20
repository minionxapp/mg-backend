import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import contactController from "../controller/contact-controller.js";

import personController from "../controller/person-controller.js";
import bankController from "../controller/bank-controller.js";

import tableController from "../controller/table-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// contact
userRouter.post('/api/contacts',contactController.create);
userRouter.get('/api/contacts/:contactId', contactController.get);
userRouter.put('/api/contacts/:contactId', contactController.update);
userRouter.delete('/api/contacts/:contactId', contactController.remove);
userRouter.get('/api/contacts', contactController.search);




// bank
userRouter.post('/api/banks',bankController.create);
userRouter.get('/api/banks/:bankId', bankController.get);
userRouter.put('/api/banks/:bankId', bankController.update);
userRouter.delete('/api/banks/:bankId', bankController.remove);
userRouter.get('/api/banks', bankController.search);



userRouter.post('/api/persons',personController.create);
userRouter.get('/api/persons/:personId', personController.get);
userRouter.put('/api/persons/:personId', personController.update);
userRouter.delete('/api/persons/:personId', personController.remove);
userRouter.get('/api/persons', personController.search);




userRouter.post('/api/tables',tableController.create);
userRouter.get('/api/tablesx/:tableName',tableController.getAll);
userRouter.get('/api/tableAll',tableController.getAllName);


export{
    userRouter
}

 
