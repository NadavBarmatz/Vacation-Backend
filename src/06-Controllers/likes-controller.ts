import express, { NextFunction, Request, Response } from 'express';
import jwt from '../01-Utils/jwt';
import verifyNotAdmin from '../02-Middleware/verify-not-admin';
import verifyToken from '../02-Middleware/verify-token';
import LikeModel from '../03-Models/like-model';
import logic from "../05-BLL/likes-logic";



const router = express.Router();

router.get("/user-likes", async (request: Request, response: Response, next: NextFunction) => {
    try{
        const user = jwt.getUserFromToken(request);
        const userLikes = await logic.getAllUserLikes(user.id)
        response.json(userLikes)
    }
    catch(err: any) {
        next(err);
    }
})

router.post("/like/:id", verifyToken, verifyNotAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        const vacationId = +request.params.id;
        const user = jwt.getUserFromToken(request);
        const like = new LikeModel(user.id, vacationId);
        const result = await logic.addLike(like);
        response.json(result);
    }
    catch(err: any) {
        next(err);
    }
})

router.delete("/dislike/:id", verifyToken, verifyNotAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try{
        const vacationId = +request.params.id;
        const user = jwt.getUserFromToken(request);
        const like = new LikeModel(user.id, vacationId);
        await logic.deleteLike(like);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
})

export default router;