// Todos:
//1: Write tests for all parts of APP. Both the FE and BE
import { errorMessages, chatEvents, elementIDs } from '../../../constants.js';
import {  renderModels,  renderChatInputValue, renderRecorder, renderMessages } from "./utils/modifyUI.js";
import { fetchModels } from "./utils/models.js";
import { Recordhandler,  } from "./utils/voice-recognition.js";
import { registerAIMessagesHandler, emitUserMessage, closeChatSocket, setupChatSocket } from "./utils/chat.js";
import isEqual from "./utils/isEqual.js";

class StateManager {
  constructor(initialState) {
    this.listeners = new Set()
    this.state = new Proxy(initialState, {
      set: (target, key, newValue, receiver) => {
        const oldState = {
          ...target
        }
        
        target[key] = newValue;

        this.notify(oldState)

        return true;
      }
    })
  }

  subscribe = (listener) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
      return true;
    };
  }

  notify = (oldState) => {
    this.listeners.forEach(listener => {
      listener({...this.state}, oldState)
    })
  }
}

// Initialize state
const modelsManager = new StateManager({ 
  models: [],
  currentModel: null,
  isLoading: false,
  error: null, // show toast message on app 
});
const messagesManager = new StateManager({
  messages: [],
  messageInput: '',
  isLoading: false,
  error: null,
  isRecording: false,
  recordingSupported: false, // Note Limited availability for recording, show tool tip error for non supported browsers,
})

// side effects
modelsManager.subscribe((newState, oldState) => {
  const { models, error } = newState;
  
  if(!isEqual(oldState.models, models)) renderModels(models)
  if (oldState.models.length === 0 && models.length > 0) {
    modelsManager.state.currentModel = models[0].value;
  }

  if (error) {
    // todo: show toast error loading models
  }
})
messagesManager.subscribe((newState, oldState) => {
  const { isRecording, messageInput, messages, error } = newState;

  if(!isEqual(oldState.messages, messages)) renderMessages(messages);
  if (oldState.isRecording !== isRecording)renderRecorder(isRecording);
  if (oldState.messageInput !== messageInput) renderChatInputValue(messageInput);
  if (error) {
    // todo: show toast error loading models
  }
})

// update state 
const toggleIsRecording = () => {
  messagesManager.state.isRecording = !messagesManager.state.isRecording;
}
const updateMessageInput = (value) => {
  messagesManager.state.messageInput = value
}
const addMessage = (message) => {
  messagesManager.state.messages = [...messagesManager.state.messages, message]
}

const {startListening, stopListening} = new Recordhandler()

// models
const updateSelectedModel = (value) => {
  modelsManager.state.currentModel = value
}
const setupModelOptions = async () => {
  try {
    modelsManager.state.isLoading = true

    const models = await fetchModels();

    modelsManager.state.models = models
  } catch (error) {
    modelsManager.state.error = error;
  } finally {
    modelsManager.state.isLoading = false
  }
}


const initiateRecord = () => {
  startListening({
    onFragment: (fragment) => {
      // don't update fragment, if recording has been stopped
      if (messagesManager.state.isRecording) {
        updateMessageInput(messagesManager.state.messageInput + fragment)
      }
    },
    onEnd: () => {
      // toggle isRecording if recording fails 
      if (messagesManager.state.isRecording) {
        toggleIsRecording()
      }
    },
    onError: () => {
      //todo: show toast message
    }
  })
}
const handleToggleRecord = () => {
  if (messagesManager.state.isRecording) {
      try {
        stopListening()
      } catch {
        // todo: show toast or silently ignore
      }
    } else {
      initiateRecord();
  }
  toggleIsRecording()
}

// messages
const handleUserMessage = (event) => {
  event.preventDefault(); 

  const newMessage = {
    role: "user",
    content: messagesManager.state.messageInput
  }
  
  addMessage(newMessage)
  updateMessageInput('')

  // emit message here
  emitUserMessage({
    modelID: modelsManager.state.currentModel,
    messages: messagesManager.state.messages
  })
    
}
const handleSystemMessage = (message) => {
  const newMessage = {
    role: "system",
    content: message
  }
  
  addMessage(newMessage);  
}

// Event handlers
document.addEventListener("DOMContentLoaded", () => {
  // setup chat socket 
  setupChatSocket();
  registerAIMessagesHandler(handleSystemMessage);

  // setup model dropdown 
  setupModelOptions()
  document.getElementById(elementIDs.models).addEventListener('change', (e) => {
    updateSelectedModel(e.target.value)
  });

  // form
  const chatForm = document.getElementById(elementIDs.chatForm)
  chatForm.addEventListener("submit", handleUserMessage);
  
  // chat input events
  const chatInput = document.getElementById(elementIDs.chatInput)
  chatInput.addEventListener('input', (e) => {
    updateMessageInput(e.target.value)
  });
  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline in textarea
      handleUserMessage(event); // Submit the form
    }
  });

  // handle record updates
  document.getElementById(elementIDs.toggleRecord).addEventListener('click', handleToggleRecord);
  document.getElementById(elementIDs.sendMessage).addEventListener('click', () => { });
});

// Cleanup
window.addEventListener('beforeunload', () => {
  closeChatSocket()
});


