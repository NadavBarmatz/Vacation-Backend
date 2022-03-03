import dotenv from "dotenv";
dotenv.config(); //change ENVIRONMENT to production on .env file b4 uploading to production

import path from 'path';
import cors from "cors";
import expressFileUpload from "express-fileupload";
import express, { NextFunction, Request, Response } from "express";
import config from "./01-Utils/config";
import errorsHandler from "./02-Middleware/errors-handler";
import ClientError from "./03-Models/client-error";
import usersController from "./06-Controllers/users-controller";
import authController from "./06-Controllers/auth-controller";
import vacationsController from "./06-Controllers/vacations-controller";
import likesController from "./06-Controllers/likes-controller";
import destinationsController from "./06-Controllers/destinations-controller";
import autoCompleteController from "./06-Controllers/auto-complete-controller"
import socketLogic from "./05-BLL/socket-logic";

// create the server:
const server = express();

// enable CORS:
server.use(cors());

// allow to use json on responses:
server.use(express.json());

server.use(express.static(path.join(__dirname, "./07-frontend")));
server.use(expressFileUpload());

// use controllers:
server.use("/api/auto-complete", autoCompleteController);
server.use("/api/users", usersController);
server.use("/api/auth", authController);
server.use("/api/destinations", destinationsController);
server.use("/api/vacations", vacationsController);
server.use("/api/likes", likesController);

// handle error on route unknown:
server.use("*", (request: Request, response: Response, next: NextFunction) => {
    response.sendFile(path.join(__dirname, "./07-frontend/index.html"));
});

// use errorHandler to handle errors:
server.use(errorsHandler);

// listen to server:
const httpServer = server.listen(config.port, () => console.log(`Server is running on port: ${config.port}`));
socketLogic.initSocketIo(httpServer);
