import Joi from "joi";

class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: number;

    public constructor(user: UserModel){
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    };

    static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(30),
        username: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(4).max(12),
        role: Joi.number().required()
    });

    static putValidationSchema = Joi.object({
        id: Joi.number().required(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(30),
        username: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(4).max(12),
        role: Joi.number().required()
    });

    static patchValidationSchema = Joi.object({
        id: Joi.number().required(),
        firstName: Joi.string().optional().min(2).max(20),
        lastName: Joi.string().optional().min(2).max(30),
        username: Joi.string().optional().min(2).max(30),
        password: Joi.string().optional().min(4).max(12),
        role: Joi.number().forbidden()
    });

    public validatePost() {
        const result = UserModel.postValidationSchema.validate(this);
        return result.error?.message;
    };

    public validatePut() {
        const result = UserModel.putValidationSchema.validate(this);
        return result.error?.message;
    };

    public validatePatch() {
        const result = UserModel.patchValidationSchema.validate(this);
        return result.error?.message;
    };

}



export default UserModel;