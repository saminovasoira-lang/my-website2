const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesEl = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const newChatBtn = document.getElementById("newChatBtn");

let conversation = [];
let waiting = false;

function resizeInput() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
}
input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

function addMessage(role, content, isError = false) {
  const row = document.createElement("div");
  row.className = `message ${role}${isError ? " error" : ""}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "S" : "D";

  const body = document.createElement("div");
  body.className = "message-body";

  const label = document.createElement("div");
  label.className = "message-role";
  label.textContent = role === "user" ? "Siz" : "Durbek AI";

  const text = document.createElement("div");
  text.className = "message-text";
  // AI matni HTML sifatida emas, oddiy matn sifatida chiqariladi.
  text.textContent = content;

  body.append(label, text);
  row.append(avatar, body);
  messagesEl.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
  return row;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "message assistant";
  row.id = "typingIndicator";
  row.innerHTML = '<div class="avatar">D</div><div class="message-body"><div class="message-role">Durbek AI javob yozmoqda</div><div class="typing"><i></i><i></i><i></i></div></div>';
  messagesEl.appendChild(row);
  row.scrollIntoView({ behavior: "smooth", block: "end" });
}

async function sendMessage(text) {
  const content = text.trim();
  if (!content || waiting) return;

  waiting = true;
  sendBtn.disabled = true;
  input.value = "";
  resizeInput();
  welcome.hidden = true;

  conversation.push({ role: "user", content });
  addMessage("user", content);
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await response.json();
    document.getElementById("typingIndicator")?.remove();

    if (!response.ok) {
      addMessage("assistant", data.error || "Xatolik yuz berdi.", true);
    } else {
      conversation.push({ role: "assistant", content: data.reply });
      addMessage("assistant", data.reply);
    }
  } catch (error) {
    document.getElementById("typingIndicator")?.remove();
    addMessage("assistant", "Server bilan bog‘lanib bo‘lmadi. Flask server ishlayotganini tekshiring.", true);
  } finally {
    waiting = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
});

newChatBtn.addEventListener("click", () => {
  conversation = [];
  messagesEl.replaceChildren();
  welcome.hidden = false;
  input.value = "";
  resizeInput();
  input.focus();
});

input.focus();
