import { OkPacket } from "mysql";
import ClientError from "../03-Models/client-error";
import UserModel from "../03-Models/user-model";
import dal from "../04-DAL/dal";


// get all logic
async function getAllUsers(): Promise<UserModel[]> {
    const sql = `SELECT UserID AS id, FirstName AS firstName, LastName AS lastName, 
                 Username AS username, Password AS password, RoleID AS role 
                 FROM users`;

    const users = await dal.execute(sql);
    return users;
}

// get one logic
async function getOneUser(id: number): Promise<UserModel> {

    const sql = `SELECT UserID AS id, FirstName AS firstName, LastName AS lastName, 
                 Username AS username, Password AS password, roles.RoleName  
                 FROM users JOIN roles ON users.RoleID = roles.RoleID
                 WHERE UserID = ${id}`;

    const users = await dal.execute(sql);
    const user = users[0];
    if(!user) throw new ClientError(404, "Resource Not Found")
    return user;
}

// add logic
async function addUser(user: UserModel): Promise<UserModel> {

    // Post validation
    const errors = user.validatePost();
    if(errors) throw new ClientError(404, errors);

    // Check if username already in use:
    const users = await getAllUsers();
    const isUsernameExist = users.find(u => u.username === user.username);
    if(isUsernameExist) throw new ClientError(404, "Username is already taken");

    const sql = `INSERT INTO users (FirstName, LastName, Username, Password, RoleID)
                 VALUES ('${user.firstName}', '${user.lastName}', '${user.username}', '${user.password}', '${user.role}')`

    const result: OkPacket = await dal.execute(sql);

    user.id = result.insertId;
    return user;
}

// update full logic
async function updateFullUser(user: UserModel): Promise<UserModel> {

    // Put validation:
    const errors = user.validatePut();
    if(errors) throw new ClientError(404, errors);


    const sql = `UPDATE users SET FirstName = '${user.firstName}',
                                  LastName = '${user.lastName}',
                                  UserName = '${user.username}',
                                  Password = '${user.password}'
                                  WHERE UserID = ${user.id};`;

    await dal.execute(sql);
    return user;
}
// update partial logic
async function updatePartialUser(user: UserModel): Promise<UserModel> {

    // Patch validation:
    const errors = user.validatePatch();
    if(errors) throw new ClientError(404, errors);

    const userDb = await getOneUser(user.id);
    
    for(const prop in user){
        if(user[prop]){
            userDb[prop] = user[prop];
        }
    }

    updateFullUser(userDb);

    return userDb;
}

// delete logic
async function deleteUser(id: number): Promise<void> {
    const sql = `DELETE FROM users WHERE UserID = ${id}`;
    await dal.execute(sql);
}

export default {
    getAllUsers,
    getOneUser,
    addUser,
    updateFullUser,
    updatePartialUser,
    deleteUser
}