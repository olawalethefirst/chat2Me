import { chatEvents, errorMessages } from "../../constants.js";
import { chat } from "../services/groq/chat.js";

export async function handleChat(socket, { model = "llama-3.3-70b-versatile", messages = [] }) {
  console.log("chat initiated: ")
  try {
      const AIResponse = await chat({model, messages});
      
      console.log("chat responded: ",{AIResponse});
      
      socket.emit(chatEvents.AI_MESSAGE, AIResponse);
    } catch (error){
    console.log("chat responded: ",{error});
      socket.emit(chatEvents.CHAT_ERROR, errorMessages.CHAT_ERROR);
  }
}