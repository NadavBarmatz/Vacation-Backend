import LikeModel from "../03-Models/like-model";
import dal from "../04-DAL/dal";
import logicHelpers from "./likes-logic-helpers";
import socketLogic from './socket-logic';


async function addLike(like: LikeModel): Promise<any> {
    const isLiked = true;

    const valid = await logicHelpers.validateLike(like);
    if(valid){
        const sql = `INSERT INTO Likes VALUES(${like.userId}, ${like.vacationId})`;
        await dal.execute(sql);
        await logicHelpers.updateVacationsLikes(like, isLiked);

        socketLogic.emitLike(like);
        return like;
    }
    
    return "You cant like vacation twice.."
}

async function deleteLike(like: LikeModel): Promise<void> {
    const isLiked = false;

    const valid = await logicHelpers.validateLike(like);
    
    if(!valid){
        const sql = `DELETE FROM Likes WHERE UserID = ${like.userId} AND VacationID = ${like.vacationId}`;
        await dal.execute(sql);
        await logicHelpers.updateVacationsLikes(like, isLiked);

        socketLogic.emitDislike(like);
        return;
    }
}

async function getAllUserLikes(userId: number): Promise<LikeModel[]> {
    const sql = `SELECT UserID AS userId, VacationID AS vacationId FROM Likes WHERE UserID = ${userId}`;
    const userLikes = await dal.execute(sql);

    return userLikes;
}


export default {
    addLike,
    deleteLike,
    getAllUserLikes
}