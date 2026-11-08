import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { discoveryPlugin } from './scripts/discovery';

export default defineConfig(() => {
  return {
    build: {
      rolldownOptions: {
        output: {
          strictExecutionOrder: true,
          codeSplitting: {
            groups: [
              {
                name: 'firebase-sdk',
                test: /node_modules[\\/](?:@firebase|firebase)[\\/]/,
                minSize: 20 * 1024,
                maxSize: 250 * 1024,
              },
            ],
          },
        },
      },
    },
    plugins: [
      {
        name: 'retire-development-service-worker',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            const workerPath = request.url?.split('?')[0];
            if (workerPath !== '/sw.js' && workerPath !== '/dev-sw.js') return next();
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            response.setHeader('Cache-Control', 'no-store, max-age=0');
            response.end(`
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map((client) => client.navigate(client.url).catch(() => {})));
  })());
});
`);
          });
        },
      },
      react(), 
      tailwindcss(),
      discoveryPlugin(),
      VitePWA({
        injectRegister: null,
        registerType: 'autoUpdate',
        manifest: {
          id: '/',
          name: 'PolyGlot Arcade Tutor',
          short_name: 'PolyArcade',
          description: 'Multi-Game Retro 2D Engine Curriculum',
          theme_color: '#0f172a',
          background_color: '#020617',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': import.meta.dirname,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
