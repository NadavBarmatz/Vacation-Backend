import LikeModel from "../03-Models/like-model";
import dal from "../04-DAL/dal";
import logicHelpers from "./likes-logic-helpers";

async function addLike(like: LikeModel): Promise<any> {
    const isLiked = true;

    const valid = await logicHelpers.validateLike(like);
    if(valid){
        const sql = `INSERT INTO Likes VALUES(${like.userId}, ${like.vacationId})`;
        await dal.execute(sql);
        await logicHelpers.updateVacationsLikes(like, isLiked);
        return like;
    }
    
    return "You cant like vacation twice.."
}

async function deleteLike(like: LikeModel): Promise<void> {
    const isLiked = false;

    const valid = await logicHelpers.validateLike(like);
    console.log(valid);
    
    if(!valid){
        const sql = `DELETE FROM Likes WHERE UserID = ${like.userId} AND VacationID = ${like.vacationId}`;
        await dal.execute(sql);
        await logicHelpers.updateVacationsLikes(like, isLiked);
        return;
    }
}

async function getAllUserLikes(userId: number): Promise<LikeModel[]> {
    const sql = `SELECT * FROM Likes WHERE UserID = ${userId}`;
    const userLikes = await dal.execute(sql);
    return userLikes;
}


export default {
    addLike,
    deleteLike,
    getAllUserLikes
}