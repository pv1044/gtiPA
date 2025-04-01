<template>
    <div class="flex flex-col h-screen p-4 bg-gray-100">
      <div class="flex-grow overflow-auto bg-white p-4 rounded-lg shadow">
        <div v-for="(message, index) in messages" :key="index" class="mb-2">
          <div :class="message.sender === 'user' ? 'text-right' : 'text-left'">
            <span class="px-4 py-2 rounded-lg" :class="message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'">
              {{ message.text }}
            </span>
          </div>
        </div>
      </div>
  
      <div class="flex mt-4">
        <input 
          v-model="inputText" 
          @keyup.enter="sendMessage" 
          class="flex-grow p-2 border rounded-lg" 
          placeholder="Enter GitHub repository URL..." 
        />
        <button @click="sendMessage" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const inputText = ref('');
  const messages = ref([]);
  
  const sendMessage = async () => {
    if (!inputText.value.trim()) return;
  
    messages.value.push({ sender: 'user', text: inputText.value });
  
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { query: inputText.value });
      messages.value.push({ sender: 'bot', text: response.data.response });
    } catch (error) {
      messages.value.push({ sender: 'bot', text: 'Error fetching response.' });
    }
  
    inputText.value = '';
  };
  </script>
  