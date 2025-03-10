export function appendMessages(messages) {
    const chatContainer = document.getElementById("chats");
    if (!chatContainer) {
        console.error("Chat container not found");
        return;
    }
    
      messages.forEach(({ type, message }) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat ${type}-chat`;
        messageDiv.textContent = message;
        chatContainer.appendChild(messageDiv);
    });
}

export function appendModels(models) {
    const modelsSelect = document.getElementById("models");

    if (!modelsSelect) {
        console.error("Models select element not found");
        return;
    }
    
    models.forEach(({ label, value }) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        modelsSelect.appendChild(option);
    });
}

export function toggleRecorder(isRecording) {
  const recordElement = document.getElementById("record");
  const stopRecordElement = document.getElementById("stop-record");

  if (!recordBtn || !stopRecordBtn) return;

  if (isRecording) {
    recordElement.classList.add("hide");
    stopRecordElement.classList.remove("hide");
  } else {
    recordElement.classList.remove("hide");
    stopRecordElement.classList.add("hide");
  }
}