import { NextFunction, Request, Response } from "express";
import jwt from "../01-Utils/jwt";
import ClientError from "../03-Models/client-error";



async function verifyToken(request: Request, response: Response, next: NextFunction): Promise<void> {
    const isValid = await jwt.verifyToken(request);

    if(!isValid) {
        const err = new ClientError(401, "Invalid or expired Token. \n Please re-login to generate new Token.");
        next(err);
        return;
    }

    next();
}

export default verifyToken;


