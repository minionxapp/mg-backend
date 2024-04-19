import express from "express";
import userController from "../controller/user-controller.js";
import tableController from "../controller/table-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/api/users',userController.register);
publicRouter.post('/api/users/login',userController.login);
publicRouter.get('/api/tables/:tableName',tableController.get);



export{
    publicRouter
}

 
