import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker enregistré:', registration);
        } catch (error) {
            console.error('Échec de l’enregistrement du Service Worker:', error);
        }
    });
}
