import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'src',
      filename: 'service-worker.js',
      manifest: {
        name: 'PWA',
        short_name: 'PWA',
        theme_color: '#007bff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://mohammedelmehdi.makhlouk.angers.mds-project.fr',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
