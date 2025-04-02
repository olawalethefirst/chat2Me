export const errorMessages = {
    NO_SPEECH_RECOGNITION: "Speech Recognition unavailable, try a different browser please!",
    GROQ_API_KEY_REQUIRED: "You need to configure the GROQ_API_KEY in .env file to use application. Get from - https://console.groq.com/keys",
    CHAT_ERROR: "Error processing message, please try again.",
    FETCHING_MODELS_FAILED: "Failed to fetch models, please reload!"
};

export const chatEvents = {
    CHAT_ERROR: "chat_error",
    USER_MESSAGE: "user_message",
    AI_MESSAGE: "ai_message"
}

export const elementIDs = {
    chatForm: 'chatForm',
    chats: 'chats',
    models: 'models',
    chatInput: 'chatInput',
    record: 'record',
    stopRecord: 'stopRecord',
    toggleRecord: "toggleRecord",
    sendMessage: "sendMessage"
}