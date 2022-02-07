import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import LikeModel from "../03-Models/like-model";
import VacationModel from "../03-Models/vacation-model";

let socketIoServer: SocketIoServer;

function initSocketIo(httpServer: HttpServer): void {
    const options = {
        cors: { origin: "*" }
    };

    socketIoServer = new SocketIoServer(httpServer, options);
    socketIoServer.sockets.on("connection", (socket: Socket) => {
        console.log("One user has been connected..");
        socket.on("disconnect", () => {
            console.log("One user has been disconnected..");
        });
    });
}

function emitAddVacation(vacation: VacationModel): void {
    socketIoServer.sockets.emit("admin-add-vacation", vacation);
}

function emitUpdateVacation(vacation: VacationModel): void {
    socketIoServer.sockets.emit("admin-update-vacation", vacation);
}

function emitDeleteVacation(id: number): void {
    socketIoServer.sockets.emit("admin-delete-vacation", id);
}

function emitLike(like: LikeModel): void {
    socketIoServer.sockets.emit("user-like-vacation", like);
}

function emitDislike(Dislike: LikeModel): void {
    socketIoServer.sockets.emit("user-dislike-vacation", Dislike);
}

function emitVacationLikesUpdate(vacation: VacationModel): void {
    socketIoServer.sockets.emit("vacation-likes-update", vacation);
}

export default {
    initSocketIo,
    emitAddVacation,
    emitUpdateVacation,
    emitDeleteVacation,
    emitLike,
    emitDislike
}