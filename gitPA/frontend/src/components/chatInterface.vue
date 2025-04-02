<template>
    <div class="chat-container">
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.sender">
          {{ msg.text }}
        </div>
      </div>
      <div class="input-container">
        <input v-model="userMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const userMessage = ref("");
  const messages = ref([]);
  
  const sendMessage = async () => {
    if (!userMessage.value.trim()) return; // Prevent sending empty messages
  
    // Add user's message to chat UI
    messages.value.push({ text: userMessage.value, sender: "user" });
  
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.value }), // Fix incorrect variable name
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      // Add bot response to chat UI
      messages.value.push({ text: data.choices[0].message.content, sender: "bot" });
    } catch (error) {
      console.error("Fetch Error:", error);
      messages.value.push({ text: "Error: Unable to fetch response", sender: "bot" });
    }
  
    // Clear input field
    userMessage.value = "";
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 500px;
    margin: auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .user {
    text-align: right;
    background-color: #daf8cb;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
  }
  
  .bot {
    text-align: left;
    background-color: #f1f1f1;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
  }
  
  .input-container {
    display: flex;
    gap: 5px;
  }
  
  input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 8px;
    background-color: blue;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  </style>
  