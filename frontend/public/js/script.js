// Todos:
//1: Write tests for all parts of APP. Both the FE and BE
import { errorMessages, chatEvents, elementIDs } from '../../../constants.js';
import {  renderModels, renderScrollableChatInput, renderChatInputValue, renderRecorder } from "./utils/modifyUI.js";
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

// models
const updateSelectedModel = (value) => {
  appState.models.currentModel = value;
}
const setupModelOptions = async () => {
  try {
    appState.models.isLoading = true
    const models = await fetchModels();
    renderModels(models)
    updateSelectedModel(models[0].value)
  } catch(error) {
    appState.models.error = error
    // todo: show toast error loading models
  } finally {
    appState.models.isLoading = false
  }
}

// handle recording 
const updateIsRecording = () => {
  appState.messages.isRecording = !appState.messages.isRecording;
}
const toggleIsRecording = () => {
  updateIsRecording();
  renderRecorder(appState.messages.isRecording);
}
const initiateRecord = () => {
  startListening({
    onStart: () => {
      console.log('starting')
    },
    onFragment: (fragment) => {
      renderChatInputValue(fragment, false)
    },
    onEnd: () => {
      // toggleIsRecording()
    },
    onError: () => {
      //todo: show toast message
    }
  })
}
const handleToggleRecord = () => {
  console.log(appState.messages.isRecording)
  try {
    if (appState.messages.isRecording) {
      stopListening()
    } else {
      initiateRecord();
    }
  } catch {
    // todo: show toast or silently ignore
  }
  
  toggleIsRecording()
}

// Event handlers
document.addEventListener("DOMContentLoaded", () => {
  // setup chat socket 
  setupChatSocket();
  registerAIMessagesHandler(console.log);

  // setup model dropdown 
  setupModelOptions()
  document.getElementById(elementIDs.models).addEventListener('change', (e) => {
    updateSelectedModel(e.target.value)
  });

  
  // chat input events
  document.getElementById(elementIDs.chatInput).addEventListener('input', (e) => {
    renderScrollableChatInput(e.target)
  });

  // handle record updates
  document.getElementById(elementIDs.toggleRecord).addEventListener('click', handleToggleRecord);
  document.getElementById(elementIDs.sendMessage).addEventListener('click', () => {});
});

// Cleanup
window.addEventListener('beforeunload', () => {
  closeChatSocket()
});


