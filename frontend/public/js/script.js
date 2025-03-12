// Todos:
//1: Write tests for all parts of APP. Both the FE and BE
//2: Separate script.js fns to utility fns directory to separate concerns.
  // keep event handlers in a common directory
  // Keep socket handlers in common directory 
// 3. keep interaction between varying utility fns here

import { errorMessages, chatEvents } from '../../../constants.js';
import { appendMessages, appendModels, updateChatInput } from "./utils/modifyUI.js";
import { fetchAndAppendModels } from "./utils/models.js";
import { startListening, stopListening } from "./utils/voice-recognition.js";
import { registerServerMessageHandler, emitServerMessage } from "./utils/chat.js";


const handleStopListening = (e) => {
  let last = e.results.length - 1;
  let lastRecognition = e.results[last];

  if (lastRecognition.isFinal) {
    let text = lastRecognition[0].transcript;
    console.log("done", {text})
  
  } else {
    console.log('Processing...', lastRecognition);
  } 
}





//  append new Messages
appendMessages([
    { type: "user", message: "Hello!" },
    { type: "ai", message: "Hello!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
    { type: "user", message: "How are you?" },
    { type: "ai", message: "I'm an AI, but I'm here to help!" },
]);

// Note Limited availability for audio, show tool tip error for non supported browsers
// track support for speechToText api and for textToSpeech too. If either is unavailable, disable button on UI, and show tooltip message upon hover 
// show toast message on app when limit reached for speech to text or fails for unforseen reason 



registerServerMessageHandler(console.log)

 
const createRecordhandler = () => {
  let isListening = false

  return () => {
    
    if (!isListening) {
      isListening = true;
      startListening({
        onMessage: (recognizedText) => { 
          updateChatInput(recognizedText);
        },
        onEnd: (recognizedText) => { 
          isListening = false;
        }
      })
    } else {
      isListening = false;
      stopListening()
    }
  }
}
const recordHandler = createRecordhandler()


// Event handlers
document.addEventListener("DOMContentLoaded", fetchAndAppendModels);
document.getElementById('recordVoice').addEventListener('click', recordHandler);
document.getElementById('sendMessage').addEventListener('click',
  () => {
    console.log("Clicking me")
    emitServerMessage({
        modelID: "llama-3.1-8b-instant",
        messages: [{
          "role": "system",
          "content": "you are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }]}, 
    )
  });


