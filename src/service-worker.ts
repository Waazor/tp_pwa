/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  console.log('Service Worker installé.');
  event.waitUntil(self.skipWaiting()); // Correction de self.skipWaiting()
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activé.');
  event.waitUntil(self.clients.claim()); // Correction de self.clients.claim()
});

self.addEventListener('push', (event) => {
  console.log('Notification push reçue.');

  const options = {
    body: 'Votre photo a été prise avec succès !',
    icon: '/icon.png',
  };

  event.waitUntil(
      self.registration.showNotification('Photo prise !', options) // Correction de self.registration
  );
});
