"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.rooms = new Map;
    }
    addUser(name, userID, roomId, socket) {
        var _a;
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: []
            });
        }
        (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.push({
            id: userID,
            name,
            conn: socket
        });
    }
    removeUser(roomId, userID) {
        var _a;
        const users = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users;
        if (users) {
            users.filter(({ id }) => id != userID);
        }
    }
    getUser(roomId, userID) {
        var _a;
        const user = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.find((({ id }) => id === userID));
        return user !== null && user !== void 0 ? user : null;
    }
    broadcast(roomId, userID, message) {
        const user = this.getUser(roomId, userID);
        if (!user) {
            console.error("User not Found!!");
            return;
        }
        const room = this.rooms.get(roomId);
        if (!room) {
            console.error("Room not Found!!");
            return;
        }
        room.users.forEach(({ conn }) => {
            conn.sendUTF(JSON.stringify(message));
        });
    }
}
exports.UserManager = UserManager;
