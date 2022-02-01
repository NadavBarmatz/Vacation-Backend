import express, { NextFunction, Request, Response } from 'express';
import verifyAdmin from '../02-Middleware/verify-admin';
import DestinationModel from '../03-Models/destination-model';
import logic from "../05-BLL/destinations-logic";


const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try{
        const destinations = await logic.getAllDestinations();
        response.json(destinations);
    }
    catch(err: any){
        next(err);
    }
});

router.get("/:id", async (request: Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        const destination = await logic.getOneDestinations(id);
        response.json(destination);
    }
    catch(err: any){
        next(err);
    }
});

router.post("/", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        const newDestination = new DestinationModel(request.body);
        const destination = await logic.addDestination(newDestination);
        response.status(201).json(destination);
    }
    catch(err: any){
        next(err);
    }
});

router.delete("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        const id = +request.params.id;
        await logic.deleteDestination(id);
        response.sendStatus(204);
    }
    catch(err: any){
        next(err);
    }
});



export default router;



