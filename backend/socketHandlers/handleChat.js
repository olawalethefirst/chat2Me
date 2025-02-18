import { chatEvents, errorMessages } from "../../constants.js";
import { chat } from "../services/groq/chat.js";

export function handleChat(socket) {
  // Listen for new messages
  socket.on(chatEvents.USER_MESSAGE, async ({model = "llama-3.3-70b-versatile", messages=[]}) => {
    try {
        const AIResponse = await chat({model, messages});
        
        console.log({AIResponse});
        
        socket.emit(chatEvents.AI_MESSAGE, AIResponse);
    } catch (error){
        socket.emit(chatEvents.ERROR, errorMessages.CHAT_ERROR);
    }
    
  })
}