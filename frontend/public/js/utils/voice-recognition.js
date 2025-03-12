import { errorMessages } from "../../../../constants.js";
import { toggleRecorder } from "./modifyUI.js";


let isListening = false;
let recognition;
let recognitionError = false; 

export const startListening = ({ onMessage, onEnd }) => {
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        // Todo: use toast to display message below on app start 
        (errorMessages.NO_SPEECH_RECOGNITION);
        return 
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;


    recognition.onresult = (event) => {
        let last = event.results.length - 1;
        let lastRecognition = event.results[last];

        if (lastRecognition.isFinal) {
            let text = lastRecognition[0].transcript;
            console.info("new recording part", {text})
            onMessage(text)
        } 
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        recognitionError = true;
    };

    recognition.onend = () => {
        if (isListening && ! recognitionError) {
            recognition.start(); // Restart if still listening
        } else {
            toggleRecorder(false)
            onEnd();
            isListening = false;
            recognitionError = false; 
        }
    };



    recognition.start()
    isListening = true
    toggleRecorder(true)
}
export const stopListening = () => {
    if (recognition && isListening) {
        recognition.stop(); // Now accessible
        isListening = false;
        console.log("Listening stopped.");
        toggleRecorder(false)
    }
}

