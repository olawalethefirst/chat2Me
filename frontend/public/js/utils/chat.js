import { chatEvents } from "../../../../constants.js";

const socket = io();

export const emitServerMessage = ({modelID, messages}) => {
  socket.emit(chatEvents.USER_MESSAGE, {model: modelID, messages});
}

export const registerServerMessageHandler = (messageHandler) => {
  socket.on(chatEvents.AI_MESSAGE, messageHandler)
}