import { errorMessages } from "../../../../constants.js";
import { toggleRecorder } from "./modifyUI.js";


let isListening = false;
let recognition; 

export const startListening = (callback) => {
    
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
            console.info("recording complete", {text})
            toggleRecorder(false)
            callback(transcript);
        } 
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Restart if still listening
        }
    };



    recognition.start()
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
