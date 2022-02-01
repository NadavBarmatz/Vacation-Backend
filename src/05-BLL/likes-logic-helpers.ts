import LikeModel from "../03-Models/like-model";
import dal from "../04-DAL/dal";

async function validateLike(like: LikeModel): Promise<boolean>{
    const sql = `SELECT UserID AS userId, VacationID as vacationId FROM Likes WHERE UserID = ${like.userId}`;
    const userLikes: LikeModel[] = await dal.execute(sql);
    // console.log(userLikes);
    
    const isLikeExist = userLikes.find(l => l.userId === like.userId && l.vacationId === like.vacationId);
    
    if(isLikeExist) return false;

    return true;
}

async function getCurrentVacationsLikes(vacationId: number): Promise<number>{
    const sql = `SELECT NumberOfLikes FROM Vacations WHERE VacationID = ${vacationId}`;
    const result = await dal.execute(sql);
    const numberOfLikes = (result[0] as any).NumberOfLikes;
    return numberOfLikes;
    
}

// Must call ONLY after like validation!!:
async function updateVacationsLikes(like: LikeModel, isLiked: boolean): Promise<void>{
    const currentVacationLikes = await getCurrentVacationsLikes(like.vacationId);
    let newVacationLikes: number;
    if(isLiked){
        newVacationLikes = currentVacationLikes + 1;
    }
    else if (!isLiked){
        newVacationLikes = currentVacationLikes - 1;
    }
    const sql = `UPDATE Vacations SET NumberOfLikes = ${newVacationLikes} WHERE VacationID = ${like.vacationId}`;
    await dal.execute(sql);
}

export default {
    validateLike,
    updateVacationsLikes
}