import express from "express";
import { publicRouter } from "../router/public-api.js";
import {errorMidlleware} from "../middleware/error-middleware.js";
import { userRouter } from "../router/user-api.js";


export const web = express();
web.use(express.json());

web.use(publicRouter);
web.use(userRouter);


web.use(errorMidlleware);

