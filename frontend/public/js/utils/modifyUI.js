import { elementIDs } from "../../../../constants.js";

export function renderMessages(messages) {
  const chatContainer = document.getElementById(elementIDs.chats);
  
  if (!chatContainer) {
      throw new Error('Chat container not found');
  }

  const fragment = document.createDocumentFragment()

  messages.forEach(({ type, message }) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat ${type}-chat`;
    messageDiv.textContent = message;
    fragment.appendChild(messageDiv);
  });

  chatContainer.appendChild(fragment);
  // scroll to bottom 
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: 'smooth'
  });
}

export function renderModels(models) {
  const modelsSelect = document.getElementById(elementIDs.models);
  
  if (!modelsSelect) {
    throw new Error("Models select element not found");
  }
  
  const fragment = document.createDocumentFragment()
  
  models.forEach(({ label, value }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    fragment.appendChild(option);
  });
  
  modelsSelect.appendChild(fragment);
}

export function renderRecorder(isRecording) {
  const recordElement = document.getElementById(elementIDs.record);
  const stopRecordElement = document.getElementById(elementIDs.stopRecord);

  if (!recordElement || !stopRecordElement) {
    throw new Error ('recordElement or stopRecordElement not found')
  };

  if (isRecording) {
    recordElement.classList.add("hide");
    stopRecordElement.classList.remove("hide");
  } else {
    recordElement.classList.remove("hide");
    stopRecordElement.classList.add("hide");
  }
}

export function renderChatInputValue(message, clearExisting = false) {
  const chatInput = document.getElementById(elementIDs.chatInput);

  if (!chatInput ) throw new Error ('Chat Input not found!');

  if (clearExisting) {
    chatInput.value = message;
  } else {
    chatInput.value += message;
  }

  chatInput.focus(); 
}

export function renderScrollableChatInput(chatInput, ) {
  if (!chatInput || !chatInput.style) throw new Error ('Chat Input not specified!');

  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}