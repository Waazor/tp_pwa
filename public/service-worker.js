self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation en cours...');
    event.waitUntil(self.skipWaiting()); // Activation immédiate
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activé');
    event.waitUntil(self.clients.claim()); // Prise en charge immédiate des clients
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Interception de :', event.request.url);
    event.respondWith(fetch(event.request));
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        console.log('[Service Worker] Affichage de la notification locale');

        const options = {
            body: 'Votre photo a été capturée avec succès !',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
        };

        self.registration.showNotification('📸 Photo prise !', options);
    }
});

self.addEventListener('push', (event) => {
    console.log('[Service Worker] Notification push reçue.');

    if (Notification.permission === 'granted') {
        const options = {
            body: 'Votre photo a été prise avec succès !',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
        };

        event.waitUntil(
            self.registration.showNotification('📸 Photo prise !', options)
        );
    } else {
        console.warn('[Service Worker] 🚫 Permission de notification refusée.');
    }
});
