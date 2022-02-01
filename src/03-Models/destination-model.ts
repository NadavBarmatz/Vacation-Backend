import Joi from "joi";

class DestinationModel {
    public destinationId: number;
    public destinationCity: string
    public destinationCountry: string

    public constructor(destination: DestinationModel) {
        this.destinationId = destination.destinationId;
        this.destinationCity = destination.destinationCity;
        this.destinationCountry = destination.destinationCountry;
    }

    static postDestinationSchema = Joi.object({
        destinationId: Joi.forbidden(),
        destinationCity: Joi.string().required(),
        destinationCountry: Joi.string().required()
    })

    public validatePostDestination() {
        const results = DestinationModel.postDestinationSchema.validate(this);
        return results.error?.message;
    }
}

export default DestinationModel;