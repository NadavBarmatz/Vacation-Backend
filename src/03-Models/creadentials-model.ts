import Joi from "joi";

class CredentialsModel {
    public username: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    static validationSchema = Joi.object({
        username: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(4).max(12)
    });

    public validateCredentials() {
        const result = CredentialsModel.validationSchema.validate(this);
        return result.error?.message;
    }

}

export default CredentialsModel;