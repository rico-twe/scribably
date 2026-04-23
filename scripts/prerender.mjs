import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const ROUTES = [
  { pathname: '/', outFile: 'dist/index.html' },
  { pathname: '/impressum', outFile: 'dist/impressum/index.html' },
  { pathname: '/datenschutz', outFile: 'dist/datenschutz/index.html' },
]

async function main() {
  console.log('Building SSR bundle...')
  await build({
    root,
    configFile: false,
    plugins: [react()],
    build: {
      ssr: resolve(root, 'src/entry-server.tsx'),
      outDir: resolve(root, 'dist/server'),
      rollupOptions: {
        input: resolve(root, 'src/entry-server.tsx'),
      },
    },
    logLevel: 'warn',
  })

  const { render } = await import(resolve(root, 'dist/server/entry-server.js'))
  const template = readFileSync(resolve(root, 'dist/index.html'), 'utf-8')

  for (const { pathname, outFile } of ROUTES) {
    const appHtml = render(pathname)
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )
    const outPath = resolve(root, outFile)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html)
    console.log(`  ✓ ${pathname} → ${outFile}`)
  }

  console.log('Prerender done.')
}

main().catch(err => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
