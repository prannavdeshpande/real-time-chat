import { _null } from "zod/v4/core/api.cjs";
import { Chat, store, UserId } from "./store";
import { ZodNull } from "zod";
let globalchatID=0;

export interface Room{
    roomId:string,
    chats:Chat[]
}

export  class InMemorystore implements store{
    private store:Map<string,Room>;
    constructor()
    {
        this.store=new Map<string,Room>
    }
    initRoom(roomId:string)
    {
        this.store.set(roomId,{
            roomId,
            chats:[]
        })

    }
    //last 50 chats(limit=50,offset=0)
    //next 50 chats (limit=50,offset=50)
    getChats(roomId:string,limit:number,offset:number)
    {
        const room=this.store.get(roomId);
        if(!room)
        {
            return [];
        }
        return room.chats.reverse().slice(0,offset).slice(-1*limit);

    }
    addChats(userID:UserId,name:string,roomId:string,message:string)
    {
        const room=this.store.get(roomId);
        if(!room)
        {
            return null
        }
        const chat= {
                ID:(globalchatID).toString(),
                userID,
                name,
                message,
                upvotes:[]
            }
        room.chats.push(chat)
        return chat

    }
    upvote(userID:UserId,roomId:string,chatId:string)
    {
        const room=this.store.get(roomId);
        if(!room)
        {
            return
        }
        //try for optimising the speed 
        const chat=room.chats.find(({ID})=>ID==chatId);
        if(chat)
        {
            chat.upvotes.push(userID);
        }
        return chat;
    }


}