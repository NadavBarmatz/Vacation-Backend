import jwt from "../01-Utils/jwt";
import ClientError from "../03-Models/client-error";
import CredentialsModel from "../03-Models/creadentials-model";
import UserModel from "../03-Models/user-model";
import dal from "../04-DAL/dal";
import userLogic from "./users-logic";

// Register:
async function register(user: UserModel): Promise<string> {
    const newUser = await userLogic.addUser(user);

    delete newUser.password;

    const token = jwt.getNewToken(newUser);

    return token;

}

// Login:
async function login(credentials: CredentialsModel): Promise<string> {
    const errors = credentials.validateCredentials();
    if(errors) throw new ClientError(400, errors);

    const users = await userLogic.getAllUsers();

    const user =  users.find(u => u.username === credentials.username && u.password === credentials.password);
    if(!user) throw new ClientError(401, "Incorrect username of password");

    delete user.password;
    const token = jwt.getNewToken(user);

    return token;
}

export default {
    register,
    login
}