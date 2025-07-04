import { createApp } from 'vue';
import App from './App.vue';
import { create } from 'naive-ui';

const app = createApp(App);
app.use(create());
app.mount('#app');
