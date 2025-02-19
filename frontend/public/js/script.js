// Todos:
//1: Write tests for all parts of APP. Both the FE and BE
//2: Separate script.js fns to utility fns directory to separate concerns.
  // keep event handlers in a common directory
  // Keep socket handlers in common directory 
// 3. keep interaction between varying utility fns here

import { errorMessages, chatEvents } from '../../../constants.js';

// APIS 
// ------------------------
// Socket IO 
const socket = io();
// ------------------------
// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    // Todo: track support for speechToText api and for textToSpeech too. 
    // If either is unavailable, disable button on UI, and show tooltip message upon hover 
    throw error(errorMessages.NO_SPEECH_RECOGNITION);
}
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;


// utilities
// const handleListening = recognition.start
const handleListening = () => {
  if (recognition) {
    alert("I hear you")
    recognition.start()
  }

  
}
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

const emitServerMessage = () => {
  socket.emit(chatEvents.USER_MESSAGE, {model: "llama-3.1-8b-instant", messages: ["who am I to you?"]});
}

// Event handlers
document.querySelector('button').addEventListener('click', emitServerMessage);
recognition.addEventListener('result', handleStopListening);


// Note Limited availability for audio, show tool tip error for non supported browsers
// track support for speechToText api and for textToSpeech too. If either is unavailable, disable button on UI, and show tooltip message upon hover 
// show toast message on app when limit reached for speech to text or fails for unforseen reason 