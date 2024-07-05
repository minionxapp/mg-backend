import express from "express";
import { publicRouter } from "../router/public-api.js";
import {errorMidlleware} from "../middleware/error-middleware.js";
import { userRouter } from "../router/user-api.js";
import cors from "cors";
// import session from "express-session";//*

//* const session = require('express-session');

//* import cors

//* const cors = require('cors')

export const web = express();

// web.use(session({///
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: false,
//   }));

web.use(cors())
web.use(express.json());

web.use(publicRouter);
web.use(userRouter);


web.use(errorMidlleware);

