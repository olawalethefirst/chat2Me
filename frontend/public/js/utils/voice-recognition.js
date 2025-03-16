import { errorMessages } from "../../../../constants.js";
export class Recordhandler {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.error = false; 
    }

    startListening = ({ onFragment, onEnd, onError }) => {
        if (!this.recognition) {
            this.recognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
        }

        if (!this.recognition) {
            return onError(errorMessages.NO_SPEECH_RECOGNITION);
        }
        
        recognition = new this.recognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;


        recognition.onresult = (event) => {
            let last = event.results.length - 1;
            let lastRecognition = event.results[last];

            if (lastRecognition.isFinal) {
                let text = lastRecognition[0].transcript;
                onFragment(text)
            } 
        };

        recognition.onerror = (event) => {
            onError(event.error);
            this.error = true;
        };

        recognition.onend = () => {
            if (this.isListening && !this.error) {
                recognition.start(); // Restart if still listening
            } else {
                onEnd();
                this.isListening = false;
                this.error = false; 
            }
        };

        recognition.start()
        this.isListening = true
    }

    stopListening = () => {
        if (this.recognition && this.isListening) {
            recognition.stop(); // Now accessible
            this.isListening = false;
            this.error=null
        } else {
            throw new Error('No recording not in progress')
        }
    }
}