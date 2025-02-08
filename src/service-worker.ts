self.addEventListener('install', (_event) => {
  console.log('Service Worker installé.');
});

self.addEventListener('activate', (_event) => {
  console.log('Service Worker activé.');
});

