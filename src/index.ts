import { connection, server as WebSocketServer } from "websocket";
import http, { OutgoingMessage } from 'http';
import { IncomingMessage, SupportedMessage } from "./messages/incomingMessages";
import { UserManager } from "./UserManager";
import { InMemorystore } from "./store/InMemoryStore";
import { OutgoingMessages ,SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";


const server = http.createServer(function(request:any, response:any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new InMemorystore();
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

function originIsAllowed(origin : string) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        //add rate limiting logic here (must)
        if (message.type === 'utf8') {
            try{
                messageHandler(connection,JSON.parse(message.utf8Data))
            }
            catch(e){

            }
            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler(ws:connection,message:IncomingMessage)
{
    if(message.type == SupportedMessage.JoinRoom)
    {
        const payload=message.payload
        userManager.addUser(payload.name,payload.userId,payload.roomId,ws)
    }
    if(message.type===SupportedMessage.SendMessage)
    {
        const payload=message.payload;
        const user=userManager.getUser(payload.roomId,payload.userId);
        if(!user)
        {
            console.error("User not Found!!!");
            return;
        }
   let chat= store.addChats(payload.userId,payload.roomId,payload.message,user.name);
     if(!chat)
     {
       return
      }
        const outgoingPayload:OutgoingMessages={
                type:OutgoingSupportedMessages.AddChat,
                payload:{
                chatId:chat.ID,
                roomId:payload.roomId,
                message:payload.message,
                name:user.name,
                upvotes:0

            }
        } 
        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload)
    }
    if(message.type===SupportedMessage.UpvoteMessage)
    {
        const payload=message.payload;
      const chat=store.upvote(payload.userId,payload.roomId,payload.chatId);
      if(!chat)
      {
        return
      }
        const outgoingPayload:OutgoingMessages={
                type:OutgoingSupportedMessages.UpdateChat,
                payload:{
                chatId:payload.chatId,
                roomId:payload.roomId,
                upvotes:chat.upvotes.length

            }
        } 
        userManager.broadcast(payload.roomId,payload.userId,outgoingPayload)

    }
}