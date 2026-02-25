import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(({ mode }) => {
  // loadEnv mantido para compatibilidade; SofaScore não precisa de chave
  loadEnv(mode, process.cwd(), '')

  const isProd = mode === 'production'
  const base = isProd ? '/agendaVolei/' : '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['volleyballIcon.png'],
        manifest: {
          name: 'Agenda Vôlei',
          short_name: 'Agenda Vôlei',
          description: 'Calendário de jogos de vôlei: Superliga, campeonatos estaduais e seleções.',
          theme_color: '#1A3A5C',
          background_color: '#F5E6C8',
          display: 'standalone',
          orientation: 'portrait',
          scope: isProd ? '/agendaVolei/' : '/',
          start_url: isProd ? '/agendaVolei/' : '/',
          lang: 'pt-BR',
          icons: [
            {
              src: `${base}volleyballIcon.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: `${base}volleyballIcon.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.sofascore\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'sofascore-cache',
                expiration: { maxEntries: 100, maxAgeSeconds: 3600 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/sofascore': {
          target: 'https://api.sofascore.com',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/sofascore/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader(
                'User-Agent',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
              )
              proxyReq.setHeader('Referer', 'https://www.sofascore.com/')
            })
          },
        },
      },
    },
  }
})
