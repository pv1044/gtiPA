<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const userInput = ref('');
const messages = ref<{ role: string; content: string }[]>([]);

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // Add user message to chat
  messages.value.push({ role: 'user', content: userInput.value });

  try {
    const response = await axios.post('http://localhost:5000/chat', {
      message: userInput.value,
    });

    // Add AI response to chat
    messages.value.push({ role: 'assistant', content: response.data.choices[0].message.content });
  } catch (error) {
    console.error('API request failed:', error);
    messages.value.push({ role: 'assistant', content: '⚠️ Error: Unable to process request' });
  }

  userInput.value = ''; // Clear input field
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message" :class="msg.role">
        <span>{{ msg.role === 'user' ? '🧑' : '🤖' }}</span>
        <p>{{ msg.content }}</p>
      </div>
    </div>

    <div class="input-box">
      <input v-model="userInput" type="text" placeholder="Enter a GitHub repository URL..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: auto;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
}

.chat-box {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-message {
  display: flex;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.user {
  background-color: #d1e7ff;
  justify-content: flex-end;
}

.assistant {
  background-color: #e3fcef;
}

.input-box {
  display: flex;
  padding: 10px;
  background: white;
}

input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 8px;
  margin-left: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
