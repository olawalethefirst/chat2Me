import { errorMessages } from "../../../../constants.js";
export class Recordhandler {
    constructor() {
        this.isListening = false;
        this.error = false; 
        this.recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new this.recognition();
        
        if (this.recognition) {
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = true;
            this.recognition.continuous = true;
        }
    }

    startListening = ({ onStart, onFragment, onEnd, onError }) => {
        if (!this.recognition) {
            return onError(errorMessages.NO_SPEECH_RECOGNITION);
        }
        
        this.recognition.onresult = (event) => {
            let last = event.results.length - 1;
            let lastRecognition = event.results[last];

            if (lastRecognition.isFinal) {
                let text = lastRecognition[0].transcript;
                onFragment && onFragment(text);
            } 
        };

        this.recognition.onerror = (event) => {
            onError && onError(event.error);
            this.error = true;
        };

        this.recognition.onend = () => {
            if (this.isListening && !this.error) {
                this.recognition.start(); // Restart if still listening
            } else {
                onEnd && onEnd();
                this.isListening = false;
                this.error = false; 
            }
        };

        this.recognition.start();
        onStart && onStart();
        this.isListening = true;
    }

    stopListening = () => {
        console.log('stopping')
        if (this.recognition && this.isListening) {
            this.recognition.stop(); // Now accessible
            this.isListening = false;
            this.error=null
        } else {
            throw new Error('No recording not in progress')
        }
    }
}