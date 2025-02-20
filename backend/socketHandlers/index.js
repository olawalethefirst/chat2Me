
import { Server } from "socket.io";
import { handleChat }  from "./handleChat.js";
import { chatEvents } from "../../constants.js";

export default function websocketHandler (server) {
    const io = new Server(server);

    // handle events
    io.on('connection', function(socket) {
      // handle user messages
      socket.on(chatEvents.USER_MESSAGE, (data) => handleChat(socket, data))
    
      // handle disconnect
      socket.on('disconnect', () => console.info('Websocket disconnected'));
    });
    
    return io
}