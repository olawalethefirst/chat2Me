import { elementIDs } from "../../../../constants.js";
import splitMessage from "./splitMessage.js";

const { marked,  hljs } = window;
const { parse } = marked;


export function toggleProcessingResponse(processingResponse, isLoading) {
  console.log("should show or hide", isLoading)
  if (!processingResponse || !processingResponse.style) throw new Error('processingResponse container not specified!');

  if (processingResponse) {
      if (isLoading) {
        processingResponse.style.visibility = "visible"
      } else {
        processingResponse.style.visibility = "hidden"
      }
    }
}

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
      const messageParts = splitMessage(content)
      const messageFragments = document.createDocumentFragment()

      
      messageParts.forEach(({ message, type }) => {
        if (type === "paragraph") {
          const paragraph = document.createElement('p')
          paragraph.innerHTML = parse(message)

          messageFragments.appendChild(paragraph)
        } else {
          const pre = document.createElement("pre");
          const code = document.createElement("code");
          code.textContent = message

          const detected = hljs.highlightAuto(message);
          code.className = `language-${detected.language || "plaintext"}`

          pre.appendChild(code);
          messageFragments.appendChild(pre);
        }
      })

      messageDiv.appendChild(messageFragments)
    }
    fragment.appendChild(messageDiv);
  });
  
  chatContainer.replaceChildren(fragment);
  hljs.highlightAll()
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