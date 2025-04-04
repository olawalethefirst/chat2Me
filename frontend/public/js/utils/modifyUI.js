import { elementIDs } from "../../../../constants.js";
import Prism from "./prism.js";

export function renderMessages(messages) {
  const chatContainer = document.getElementById(elementIDs.chats);
  
  if (!chatContainer) {
      throw new Error('Chat container not found');
  }

  const fragment = document.createDocumentFragment()

  messages.forEach(({ role, content }) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat ${role}-chat`;

    if (role === "user") {
      messageDiv.textContent = content;
    } else if (role === "system") {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
  
      pre.className = `language-javascript`;
      code.className = `language-javascript`;
      code.textContent = content;
      
      // Todo: implement autodeting and highlighting of code 
      // Auto-detect language using highlight.js
      // const detected = hljs.highlightAuto(content);
      // code.className = `language-${detected.language || "plaintext"}`;
  
      pre.appendChild(code);
      messageDiv.appendChild(pre);
      
      // Highlight with Prism.js
      Prism.highlightElement(code);
    }
    fragment.appendChild(messageDiv);
  });
  
  chatContainer.replaceChildren(fragment);

  chatContainer.lastElementChild?.scrollIntoView({ behavior: "smooth" });
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
  
  modelsSelect.replaceChildren(fragment);
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

export function renderScrollableChatInput(chatInput) {
  if (!chatInput || !chatInput.style) throw new Error ('Chat Input not specified!');

  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

export function renderChatInputValue(message) {
  const chatInput = document.getElementById(elementIDs.chatInput);

  if (!chatInput ) throw new Error ('Chat Input not found!');

  chatInput.value = message;
  renderScrollableChatInput(chatInput)

  chatInput.focus(); 
}