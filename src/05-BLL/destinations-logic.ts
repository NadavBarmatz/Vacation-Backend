import { OkPacket } from 'mysql';
import dal from "../04-DAL/dal";
import DestinationModel from "../03-Models/destination-model";
import ClientError from '../03-Models/client-error';

async function getAllDestinations(): Promise<DestinationModel> {
    const sql = `SELECT DestinationID AS destinationId, DestinationCity AS destinationCity, DestinationCountry AS destinationCountry
                 FROM Destinations`;

    const destinations = await dal.execute(sql);
    return destinations;
}

async function getOneDestinations(id: number): Promise<DestinationModel> {
    const sql = `SELECT DestinationID AS destinationId, DestinationCity AS destinationCity, DestinationCountry AS destinationCountry
                 FROM Destinations WHERE DestinationID = ${id}`;

    const destinations = await dal.execute(sql);
    const destination = destinations[0];
    if(!destination) throw new ClientError(404, "Destination was not found")
    return destination;
}

async function addDestination(destination: DestinationModel): Promise<DestinationModel> {

    // Validation:
    const errors = destination.validatePostDestination();
    if(errors) throw new ClientError(404, errors);

    const sql = `INSERT INTO Destinations (DestinationCity, DestinationCountry) 
                 VALUES ('${destination.destinationCity}', '${destination.destinationCountry}')`;

    const result: OkPacket = await dal.execute(sql);
    destination.destinationId = result.insertId;
    return destination;
}

async function deleteDestination(id: number) {
    const sql = `DELETE FROM Destinations WHERE DestinationID = ${id}`;
    await dal.execute(sql);
}

export default {
    getAllDestinations,
    getOneDestinations,
    addDestination,
    deleteDestination
}