export type UserId=string;
export interface Chat{
    ID:string
    userID:UserId,
    name:string,
    message:string,
    upvotes:UserId[];//who has upvoted what

}
export abstract class store{
    constructor()
    {

    }
    initRoom(roomId:string)
    {

    }
    getChats(roomId:string,limit:number,offset:number)
    {

    }
   addChats(userID:UserId,name:string,roomId:string,message:string)
    {

    }
    upvote(userID:UserId,room:string,chatId:string)
    {

    }


}