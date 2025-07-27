import { connection } from "websocket"
import { OutgoingMessages } from "./messages/outgoingMessages"

interface User{
    name:string,
    id:string,
    conn:connection
}
interface Room{
    users:User[]
}

export class UserManager
{
    private rooms:Map<string,Room>
    constructor()
    {
        this.rooms=new Map<string,Room>
    }
    addUser(name:string,userID:string,roomId:string,socket:connection)
    {
        if(!this.rooms.get(roomId))
        {
            this.rooms.set(roomId,{
                users:[]
            })
        }
        this.rooms.get(roomId)?.users.push({
            id:userID,
            name,
            conn:socket
        })

    }
    removeUser(roomId:string,userID:string)
    {
         const users=this.rooms.get(roomId)?.users;
         if(users)
         {
            users.filter(({id})=>id!=userID); 
         }
    }

    getUser(roomId:string,userID:string):User|null
    {
        const user=this.rooms.get(roomId)?.users.find((({id})=>id===userID));
        return user??null; 

    }

    broadcast(roomId:string,userID:string,message:OutgoingMessages,)
    {
        const user = this.getUser(roomId,userID);
        if(!user)
        {
            console.error("User not Found!!");
            return;
        }
        const room = this.rooms.get(roomId);
        if(!room)
        {
            console.error("Room not Found!!");
            return;
        }
        room.users.forEach(({conn})=>{
            conn.sendUTF(JSON.stringify(message))
        })
    }
}