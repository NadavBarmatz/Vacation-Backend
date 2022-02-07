import { Request, Response, NextFunction } from "express";
import jwt from "../01-Utils/jwt";
import ClientError from "../03-Models/client-error";
import Role from "../03-Models/role";

function verifyNotAdmin(request: Request, response: Response, next: NextFunction): void {
    const user = jwt.getUserFromToken(request);

    if(user.role === Role.Admin) {
        const err = new ClientError(401, "Admin is not allowed");
        next(err);
    }

    next();
}

export default verifyNotAdmin;