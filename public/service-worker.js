self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activé');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Interception de : ', event.request.url);
    event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
    console.log('[Service Worker] Notification push reçue.');

    const options = {
        body: 'Votre photo a été prise avec succès !',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
    };

    event.waitUntil(
        self.registration.showNotification('Photo prise !', options)
    );
});
