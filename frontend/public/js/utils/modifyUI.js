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
