/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function umamiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'umami-inject',
    transformIndexHtml() {
      const src = env.VITE_UMAMI_SRC
      const websiteId = env.VITE_UMAMI_WEBSITE_ID
      if (!src || !websiteId) return []
      return [{ tag: 'script', attrs: { defer: true, src, 'data-website-id': websiteId }, injectTo: 'head' }]
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), umamiPlugin(env)],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})
