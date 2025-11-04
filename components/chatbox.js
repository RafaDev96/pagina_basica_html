document.addEventListener("DOMContentLoaded", () => {
  const chatbox = document.getElementById("chatbox");
  const toggle = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("close-chat");
  const emojiBar = document.querySelector(".chatbox-emojis");
  const input = document.getElementById("chatbox-input");
  const messages = document.getElementById("chatbox-messages");
  const sendBtn = document.getElementById("send-btn");

  // ➡️ 1. Variável para armazenar o nome do usuário. 
  // Inicializamos com null. Ela será preenchida ao abrir o chat.
  let currentUserName = null; 

  // Abre o chat
  toggle.addEventListener("click", () => {
    // Se o chat já está aberto, apenas ignora o resto da lógica e foca em abri-lo.
    if (chatbox.classList.contains("open")) {
        return;
    }

    // ==========================================================
    // ➡️ 2. LÓGICA DO NOME MOVIDA PARA DENTRO DO CLIQUE DO TOGGLE
    // ==========================================================
    if (currentUserName === null) {
        const storedName = localStorage.getItem('chatUserName');

        if (storedName) {
            currentUserName = storedName;
        } else {
            const nameInput = prompt("Olá! Por favor, digite seu nome para o chat:");
            
            if (nameInput && nameInput.trim() !== "") {
                currentUserName = nameInput.trim();
                // Armazena no localStorage para não perguntar novamente
                localStorage.setItem('chatUserName', currentUserName); 
            } else {
                currentUserName = "Visitante Anônimo"; // Nome padrão
            }
        }
    }
    // ==========================================================
    
    // Abre o chatbox APÓS a definição do nome
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

    // Se por algum motivo o nome não foi definido (o que não deve acontecer), usa um fallback
    const userDisplay = currentUserName || "Usuário Desconhecido"; 

    const msgElem = document.createElement("div");
    msgElem.className = "message user";
    
    // Adiciona o nome do usuário à mensagem
    const userNameSpan = document.createElement("strong");
    userNameSpan.className = "message-user-name";
    userNameSpan.textContent = userDisplay + ": ";
    
    msgElem.appendChild(userNameSpan);
    
    const messageText = document.createElement("span");
    messageText.textContent = text;
    msgElem.appendChild(messageText);

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