import express, { NextFunction, Request, Response } from "express";
import path from "path";
import jwt from "../01-Utils/jwt";
import verifyAdmin from "../02-Middleware/verify-admin";
import verifyToken from "../02-Middleware/verify-token";
import LikeModel from "../03-Models/like-model";
import VacationModel from "../03-Models/vacation-model";
import logic from "../05-BLL/vacations-logic";

const router = express.Router();

// GET ALL:
router.get("/", async (request : Request, response: Response, next: NextFunction) => {
    try{
        const vacations = await logic.getAllVacations();
        response.json(vacations);
    }
    catch(err: any) {
    }
});

// GET ALL by destination id:
router.get("/by-destination/:id", async (request : Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        const vacations = await logic.getAllVacationsByDestination(id);
        response.json(vacations);
    }
    catch(err: any) {
    }
});

// GET ONE:
router.get("/:id", async (request : Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;

        const vacation = await logic.getOneVacation(id);
        response.json(vacation);
    }
    catch(err: any) {
    }
});

// POST:
router.post("/", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.image = request.files?.image;
        const vacation = new VacationModel(request.body);
        
        const addedVacation = await logic.addVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch(err: any) {
        next(err);
    }
});

// PUT:
router.put("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.image = request.files?.image;
        request.body.vacationId = request.params.id;
        const vacation = new VacationModel(request.body);
        const updatedVacation = await logic.fullUpdateVacation(vacation);
        response.json(updatedVacation);
    }
    catch(err: any) {
        next(err);
    }
});

// PATCH:
router.patch("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        request.body.image = request.files?.image;
        request.body.vacationId = request.params.id;
        const vacation = new VacationModel(request.body);
        const updatedVacation = await logic.partialUpdateVacation(vacation);
        response.json(updatedVacation);
    }
    catch(err: any) {
        next(err);
    }
});

// Delete vacation:
router.delete("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        await logic.deleteVacation(id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/images/:imageName", (request: Request, response: Response, next: NextFunction) => {
    try{
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "00-images", imageName);
        response.sendFile(absolutePath);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;