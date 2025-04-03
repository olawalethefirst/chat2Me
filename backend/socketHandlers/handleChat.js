import { chatEvents, errorMessages } from "../../constants.js";
import { chat } from "../services/groq/chat.js";

export async function handleChat(socket, { model = "llama-3.3-70b-versatile", messages = [] }) {
  try {
      const AIResponse = await chat({model, messages});
      
      socket.emit(chatEvents.AI_MESSAGE, AIResponse);
    } catch (error){
      console.error('An error occured:', error)
      socket.emit(chatEvents.CHAT_ERROR, errorMessages.CHAT_ERROR);
  }
}