// Todos:
//1: Write tests for all parts of APP. Both the FE and BE
import { errorMessages, chatEvents, elementIDs } from '../../../constants.js';
import {  renderModels, } from "./utils/modifyUI.js";
import { fetchModels } from "./utils/models.js";
import { Recordhandler,  } from "./utils/voice-recognition.js";
import { registerAIMessagesHandler, emitUserMessage, closeChatSocket, setupChatSocket } from "./utils/chat.js";

const appState = {
  models: {
    currentModel: null,
    isLoading: false,
    error: null, // show toast message on app 
  },
  messages: {
    data: [],
    isLoading: false,
    error: null,
    isRecording: false,
    recordingSupported: false, // Note Limited availability for recording, show tool tip error for non supported browsers,
  },
};


const {startListening, stopListening} = new Recordhandler()
 
const setupModelOptions = async () => {
  try {
    appState.models.isLoading = true
    const models = await fetchModels();
    renderModels(models)
    appState.models.currentModel = models[0].value
  } catch(error) {
    appState.models.error = error
    // todo: show toast error loading models
  } finally {
    appState.models.isLoading = false
  }
}

// Event handlers
document.addEventListener("DOMContentLoaded", () => {
  // setup chat socket 
  setupChatSocket()
  registerAIMessagesHandler(console.log)

  // setup model dropdown options
  setupModelOptions()

  document.getElementById(elementIDs.toggleRecord).addEventListener('click', () => {});
  document.getElementById(elementIDs.sendMessage).addEventListener('click', () => {});
  document.getElementById(elementIDs.models).addEventListener('change', console.log);
});

// Cleanup
window.addEventListener('beforeunload', () => {
  closeChatSocket()
});


