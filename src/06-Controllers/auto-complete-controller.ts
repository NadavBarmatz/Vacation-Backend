import express, { NextFunction, Request, Response } from 'express';
import logic from "../05-BLL/auto-complete-logic";

const router = express.Router();

router.get("/:str?", async (request: Request, response: Response, next: NextFunction) => {
    try{
        const str = request.params.str;
        const destinations = await logic.autoCompleteSearch(str);
        response.json(destinations);
    }
    catch(err: any){
        next(err);
    }
})

export default router;