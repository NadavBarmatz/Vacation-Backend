import fs from "fs"
import {v4 as uuid} from "uuid";
import VacationModel from "../03-Models/vacation-model";

async function saveImageToDb(vacation: VacationModel): Promise<void> {

    // Get the file extension:
    const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));

    vacation.imageName = uuid() + extension;

    await vacation.image.mv("./src/00-images/" + vacation.imageName);

}

function deleteImageFromDb(absolutePath: string): Promise<void> {
        // If undefined / null - do nothing:
        if(!absolutePath) return;

        // Only if file exists in disk - try to delete it:
        if(fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath); // Delete file.
        }
}

export default {
    saveImageToDb,
    deleteImageFromDb
}