import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css'; // If using Tailwind CSS

const app = createApp(App);
app.use(router);
app.mount('#app');
