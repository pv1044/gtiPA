<template>
  <div class="chat-container">
    <div v-if="showWelcome" class="welcome-message">What can I help with?</div>
    <div class="chat-messages" ref="chatContainer">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.sender">
        <div class="message-content">
          <p>{{ msg.text }}</p>
        </div>
      </div>
      <div v-if="isLoading" class="message bot">
        <div class="message-content loading">Thinking...</div>
      </div>
    </div>

    <div class="input-container">
      <div class="input-box">
        <input v-model="userMessage" @keyup.enter="sendMessage" placeholder="Ask anything..." />
        <button @click="sendMessage" :disabled="isLoading" class="send-button">
          ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, nextTick } from "vue";
  const  showWelcome = ref(true)
  const userMessage = ref("");
  const messages = ref([]);
  const isLoading = ref(false);
  const chatContainer = ref(null);

  const sendMessage = async () => {
    showWelcome.value = false
    if (!userMessage.value.trim()) return;
    messages.value.push({ sender: "user", text: userMessage.value });
    isLoading.value = true;
    const userInput = userMessage.value;
    userMessage.value = "";

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      messages.value.push({ sender: "bot", text: data.choices[0].message.content });
    } catch (error) {
      console.error("Fetch Error:", error.message);
      messages.value.push({ sender: "bot", text: "⚠️ Failed to get a response." });
    } finally {
      isLoading.value = false;
      nextTick(() => {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      });
    }
  };
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chat-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #121212;
  color: white;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

.welcome-message {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  max-width: 600px;
  width: 100%;
  padding: 20px;
  scroll-behavior: smooth;
}

.message {
  max-width: 75%;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  word-wrap: break-word;
}

.user {
  background-color: #3a3a3c;
  align-self: flex-end;
  text-align: right;
  border-radius: 8px 8px 0 8px;
}

.bot {
  background-color: #282828;
  align-self: flex-start;
  border-radius: 8px 8px 8px 0;
}

.input-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #121212;
}

.input-box {
  display: flex;
  align-items: center;
  background: #2a2a2e;
  border-radius: 25px;
  padding: 10px;
  width: 600px;
}

input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  background: transparent;
  color: white;
  font-size: 16px;
}

.send-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  transition: 0.3s;
}

.send-button:disabled {
  color: gray;
  cursor: not-allowed;
}
</style>
