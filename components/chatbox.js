document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox");
  const toggle = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("close-chat");
  const emojiBar = document.querySelector(".chatbox-emojis");
  const input = document.getElementById("chatbox-input");
  const messages = document.getElementById("chatbox-messages");
  const sendBtn = document.getElementById("send-btn");

  // Abre o chat
  toggle.addEventListener("click", () => {
    chatbox.classList.add("open");
  });

  // Fecha o chat
  closeBtn.addEventListener("click", () => {
    chatbox.classList.remove("open");
  });

  // Emojis clicáveis
  emojiBar.addEventListener("click", (e) => {
    if (e.target.textContent.trim()) {
      input.value += e.target.textContent;
      input.focus();
    }
  });

  // Envia mensagem
  function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    const msgElem = document.createElement("div");
    msgElem.className = "message user";
    msgElem.textContent = text;
    messages.appendChild(msgElem);
    messages.scrollTop = messages.scrollHeight;

    input.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
      e.preventDefault();
    }
  });
});
