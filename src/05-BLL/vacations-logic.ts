import { OkPacket } from 'mysql';
import handleImages from '../01-Utils/handle-images';
import ClientError from '../03-Models/client-error';
import VacationModel from "../03-Models/vacation-model";
import dal from "../04-DAL/dal";
import socketLogic from './socket-logic';

// Get all logic:
async function getAllVacations(): Promise<VacationModel[]> {
    const sql = `SELECT VacationID AS vacationId,
                 Vacations.DestinationID AS destinationId,
                 VacationDescription AS description,
                 Destinations.DestinationCity AS city,
                 Destinations.DestinationCountry AS country,
                 DATE_FORMAT(StartDateTime, '%Y-%m-%d %H:%i') AS start,
                 DATE_FORMAT(EndDateTime, '%Y-%m-%d %H:%i') AS end,
                 Price AS price,
                 NumberOfLikes AS likes,
                 imageName
                 FROM Vacations 
                 JOIN Destinations ON Vacations.DestinationID = Destinations.DestinationID`;

    const vacations = await dal.execute(sql);
    return vacations;
}

// GET all vacations by destination id:
async function getAllVacationsByDestination(id: number): Promise<VacationModel[]> {

    if(isNaN(id)) throw new ClientError(404, "Destination not found. Search for a different location.");
    
    const sql = `SELECT VacationID AS vacationId,
                 Vacations.DestinationID AS destinationId,
                 VacationDescription AS description,
                 Destinations.DestinationCity AS city,
                 Destinations.DestinationCountry AS country,
                 DATE_FORMAT(StartDateTime, '%Y-%m-%d %H:%i') AS start,
                 DATE_FORMAT(EndDateTime, '%Y-%m-%d %H:%i') AS end,
                 Price AS price,
                 NumberOfLikes AS likes,
                 imageName
                 FROM Vacations 
                 JOIN Destinations ON Vacations.DestinationID = Destinations.DestinationID
                 WHERE Vacations.DestinationID = ${id}`;

    const vacations = await dal.execute(sql);
    console.log(vacations)

    console.log(vacations.length)

    if(vacations.length === 0){
        throw new ClientError(404, "Destination not found. Search for a different location.");
    } 


    return vacations;
}

// Get one logic:
async function getOneVacation(id: number): Promise<VacationModel> {
    const sql = `SELECT VacationID AS vacationId,
                 Vacations.DestinationID AS destinationId,
                 VacationDescription AS description,
                 Destinations.DestinationCity AS city,
                 Destinations.DestinationCountry AS country,
                 DATE_FORMAT(StartDateTime, '%Y-%m-%d %H:%i') AS start,
                 DATE_FORMAT(EndDateTime, '%Y-%m-%d %H:%i') AS end,
                 Price AS price,
                 NumberOfLikes AS likes,
                 imageName
                 FROM Vacations 
                 JOIN Destinations ON Vacations.DestinationID = Destinations.DestinationID
                 WHERE VacationID = ${id}`;

    const vacations = await dal.execute(sql);
    const vacation = vacations[0];

    socketLogic.emitVacationLikesUpdate(vacation);

    return vacation;
}

// Add vacation logic:
async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    // Validate post:
    const errors = vacation.validatePost();
    if(errors) throw new ClientError(404, errors);


    handleImages.saveImageToDb(vacation);
    delete vacation.image;

    const sql = `INSERT INTO Vacations (DestinationID, VacationDescription, StartDateTime, EndDateTime, Price, imageName)
                 VALUES (${vacation.destinationId}, '${vacation.description}', '${vacation.start}', '${vacation.end}', ${vacation.price}, '${vacation.imageName}')`; 

    const result: OkPacket = await dal.execute(sql);

    vacation.vacationId = result.insertId;
    vacation.likes = 0;

    socketLogic.emitAddVacation(vacation);

    return vacation;
}

// Full update logic:
async function fullUpdateVacation(vacation: VacationModel): Promise<VacationModel> {
    // Validate put:
    const errors = vacation.validatePut();
    if(errors) throw new ClientError(404, errors);

    const oldImage = await getOneVacation(vacation.vacationId);
    if(oldImage.imageName){
        handleImages.deleteImageFromDb("./src/00-Images/" + oldImage.destinationId + "/" + oldImage.imageName)
    }
    handleImages.saveImageToDb(vacation);
    delete vacation.image;

    const sql = `UPDATE Vacations
                 SET DestinationID = ${vacation.destinationId}, VacationDescription = "${vacation.description}",
                 StartDateTime = '${vacation.start}', EndDateTime = '${vacation.end}', Price = ${vacation.price},
                 imageName = '${vacation.imageName}'
                 WHERE VacationID = ${vacation.vacationId}`;

    await dal.execute(sql);

    const updatedVacation = await getOneVacation(vacation.vacationId);

    socketLogic.emitUpdateVacation(updatedVacation);

    return updatedVacation;
    
}

// Partial update logic:
async function partialUpdateVacation(vacation: VacationModel): Promise<VacationModel> {

    // Validate patch:
    const errors = vacation.validatePatch();
    if(errors) throw new ClientError(404, errors);

    const vacationDb = await getOneVacation(vacation.vacationId);

    for(const prop in vacation){
        if(vacation[prop] !== undefined){
            vacationDb[prop] = vacation[prop];
        }
    }

    console.log(vacationDb)
    delete vacationDb.imageName;
    delete vacationDb.likes;
    delete (vacationDb as any).city;
    delete (vacationDb as any).country;

    const updatedVacation = await fullUpdateVacation(vacationDb);
    return updatedVacation;
}

// Delete vacation logic:
async function deleteVacation(id: number): Promise<void> {
    const oldVacation = await getOneVacation(id);
    handleImages.deleteImageFromDb("./src/00-Images/" + oldVacation.imageName);
    const sql = `DELETE FROM Vacations WHERE VacationID = ${id}`;
    await dal.execute(sql);

    socketLogic.emitDeleteVacation(id);
}

export default {
    getAllVacations,
    getAllVacationsByDestination,
    getOneVacation,
    addVacation,
    fullUpdateVacation,
    partialUpdateVacation,
    deleteVacation
}