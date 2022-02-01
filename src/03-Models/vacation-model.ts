import { UploadedFile } from "express-fileupload";
import Joi from "joi";

class VacationModel {

    public vacationId: number;
    public destinationId: number;
    public description: string;
    public start: string;
    public end: string;
    public price: number;
    public likes: number;
    public imageName: string;
    public image: UploadedFile;

    public constructor(vacation: VacationModel){
        console.log(vacation.vacationId);
        
        this.vacationId = vacation.vacationId;
        this.destinationId = vacation.destinationId;
        this.description = vacation.description;
        this.start = vacation.start;
        this.end = vacation.end;
        this.price = vacation.price;
        this.likes = vacation.likes;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
    }

    static postValidationSchema = Joi.object({
        vacationId: Joi.forbidden(),
        destinationId: Joi.number().required(),
        description: Joi.string().required().min(10).max(2000),
        start: Joi.string().required(),
        end: Joi.string().required(),
        price: Joi.number().required().min(20).max(2000),
        likes: Joi.forbidden(),
        imageName: Joi.forbidden(),
        image: Joi.object().required()
    })

    static putValidationSchema = Joi.object({
        vacationId: Joi.required(),
        destinationId: Joi.number().required(),
        description: Joi.string().required().min(10).max(2000),
        start: Joi.string().required(),
        end: Joi.string().required(),
        price: Joi.number().required().min(20).max(2000),
        likes: Joi.forbidden(),
        imageName: Joi.forbidden(),
        image: Joi.object().optional(),
        validatePost: Joi.function().required(),
        validatePut: Joi.function().required(),
        validatePatch: Joi.function().required()
    })

    static patchValidationSchema = Joi.object({
        vacationId: Joi.required(),
        destinationId: Joi.number().optional(),
        description: Joi.string().optional().min(10).max(2000),
        start: Joi.string().optional(),
        end: Joi.string().optional(),
        price: Joi.number().optional().min(20).max(2000),
        likes: Joi.forbidden(),
        imageName: Joi.forbidden(),
        image: Joi.object().optional()
    })

    public validatePost() {
        const result = VacationModel.postValidationSchema.validate(this);
        return result.error?.message
    } 

    public validatePut() {
        const result = VacationModel.putValidationSchema.validate(this);
        return result.error?.message
    } 

    public validatePatch() {
        const result = VacationModel.patchValidationSchema.validate(this);
        return result.error?.message
    } 

}

export default VacationModel;