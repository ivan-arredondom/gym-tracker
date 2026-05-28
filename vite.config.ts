import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/gym-tracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/**', 'icons/**'],
      manifest: {
        name: 'Gym Tracker',
        short_name: 'Gym Tracker',
        description: 'Offline workout logger',
        theme_color: '#0a0a0b',
        background_color: '#0a0a0b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/gym-tracker/',
        scope: '/gym-tracker/',
        icons: [
          { src: '/gym-tracker/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/gym-tracker/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/gym-tracker/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,woff,png,svg,ico}'],
        runtimeCaching: [],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
});
