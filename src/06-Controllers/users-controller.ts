import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-Middleware/verify-admin";
import Role from "../03-Models/role";
import UserModel from "../03-Models/user-model";
import logic from "../05-BLL/users-logic";

const router = express.Router();

// GET all route:
router.get("/", async(request: Request, response: Response, next: NextFunction) => {
    try{
        const users = await logic.getAllUsers();
        response.json(users);
    }
    catch(err: any){
        next(err);
    }
});

// GET one route:
router.get("/:id", async(request: Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        const user = await logic.getOneUser(id);
        response.json(user);
    }
    catch(err: any){
        next(err);
    }
});

// POST route:
router.post("/", async(request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.role = Role.User; // Make sure added user has User role
        const user = new UserModel(request.body);
        const addedUser = await logic.addUser(user);
        response.status(201).json(addedUser);
    }
    catch(err: any){
        next(err);
    }
});

// PUT route:
router.put("/:id", async(request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.id = +request.params.id;
        const user = new UserModel(request.body);
        const updatedUser = await logic.updateFullUser(user);
        response.json(updatedUser);
    }
    catch(err: any){
        next(err);
    }
});

// PATCH route:
router.patch("/:id", async(request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.id = +request.params.id;
        const user = new UserModel(request.body);
        const updatedUser = await logic.updatePartialUser(user);
        response.json(updatedUser);
    }
    catch(err: any){
        next(err);
    }
});

// DELETE route:
router.delete("/:id", verifyAdmin, async(request: Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        await logic.deleteUser(id);
        response.sendStatus(204);
    }
    catch(err: any){
        next(err);
    }
});

export default router;