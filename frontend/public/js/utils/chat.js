import { chatEvents } from "../../../../constants.js";

let socket = io();


export const setupChatSocket = () => {
  // Close any existing connection
  if (socket) {
    socket.disconnect();
  }

  socket = io();


  socket.on('connect', () => {
    console.info('chat socket established');
  });

  socket.on('disconnect', () => {
    console.log('chat socket disconnected');
  });
  
  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
}

export const closeChatSocket = () => {
  // Close connection
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export const emitUserMessage = ({modelID, messages}) => {
  socket.emit(chatEvents.USER_MESSAGE, {model: modelID, messages});
}

export const registerAIMessagesHandler = (messageHandler) => {
  socket.on(chatEvents.AI_MESSAGE, messageHandler)
}