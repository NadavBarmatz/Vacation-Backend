import ClientError from "../03-Models/client-error";
import DestinationModel from "../03-Models/destination-model";
import dal from "../04-DAL/dal";

async function autoCompleteSearch(str: string){
    if(!str) {
        return [];
    };

    const sql = `SELECT DestinationID AS destinationId, 
                 DestinationCity AS destinationCity, 
                 DestinationCountry AS destinationCountry
                 FROM Destinations
                 WHERE DestinationCity LIKE '${str}%' OR DestinationCountry LIKE '${str}%'`;

    const destinations = await dal.execute(sql);

    return destinations;
}

export default {
    autoCompleteSearch
}