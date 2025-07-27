"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorystore = void 0;
let globalchatID = 0;
class InMemorystore {
    constructor() {
        this.store = new Map;
    }
    initRoom(roomId) {
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    }
    //last 50 chats(limit=50,offset=0)
    //next 50 chats (limit=50,offset=50)
    getChats(roomId, limit, offset) {
        const room = this.store.get(roomId);
        if (!room) {
            return [];
        }
        return room.chats.reverse().slice(0, offset).slice(-1 * limit);
    }
    addChats(userID, name, roomId, message) {
        const room = this.store.get(roomId);
        if (!room) {
            return null;
        }
        const chat = {
            ID: (globalchatID).toString(),
            userID,
            name,
            message,
            upvotes: []
        };
        room.chats.push(chat);
        return chat;
    }
    upvote(userID, roomId, chatId) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        //try for optimising the speed 
        const chat = room.chats.find(({ ID }) => ID == chatId);
        if (chat) {
            chat.upvotes.push(userID);
        }
        return chat;
    }
}
exports.InMemorystore = InMemorystore;
