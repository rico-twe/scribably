import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const ROUTES = [
  {
    pathname: '/',
    outFile: 'dist/index.html',
    lang: 'en',
    locale: 'en_US',
    canonical: 'https://scribably.com/',
    title: 'Scribably — Speech to AI Prompts in Your Browser',
    description: 'Scribably turns speech into polished AI prompts — entirely in your browser. Bring your own Groq or OpenAI key, keep data local. Free and open source. Try it free — no signup.',
    ogTitle: 'Scribably — Speech to AI Prompts in Your Browser',
    ogDescription: 'Turn speech into polished AI prompts — in your browser. BYOK, no server, no account needed. Free and open source.',
    noindex: false,
  },
  {
    pathname: '/impressum',
    outFile: 'dist/impressum/index.html',
    lang: 'de',
    locale: 'de_DE',
    canonical: 'https://scribably.com/impressum',
    title: 'Impressum · Scribably',
    description: 'Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Scribably.',
    ogTitle: 'Impressum · Scribably',
    ogDescription: 'Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Scribably.',
    noindex: true,
  },
  {
    pathname: '/datenschutz',
    outFile: 'dist/datenschutz/index.html',
    lang: 'de',
    locale: 'de_DE',
    canonical: 'https://scribably.com/datenschutz',
    title: 'Datenschutz · Scribably',
    description: 'Datenschutzerklärung für Scribably — eine reine Client-Anwendung ohne eigenen Server.',
    ogTitle: 'Datenschutz · Scribably',
    ogDescription: 'Datenschutzerklärung für Scribably — eine reine Client-Anwendung ohne eigenen Server.',
    noindex: true,
  },
]

function applyRouteMeta(html, route) {
  html = html.replace(
    /(<html[^>]*) lang="[^"]*"/,
    `$1 lang="${route.lang}"`
  )
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${route.canonical}" />`
  )
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${route.canonical}" />`
  )
  html = html.replace(
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${route.locale}" />`
  )
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${route.ogTitle}" />`
  )
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${route.ogDescription}" />`
  )
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${route.ogTitle}" />`
  )
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${route.ogDescription}" />`
  )
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${route.title}</title>`
  )
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${route.description}" />`
  )
  if (route.noindex) {
    html = html.replace(
      /(\s*)<\/head>/,
      `$1  <meta name="robots" content="noindex,nofollow" />\n  </head>`
    )
  }
  return html
}

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

  for (const route of ROUTES) {
    const appHtml = render(route.pathname)
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    )
    html = applyRouteMeta(html, route)
    const outPath = resolve(root, route.outFile)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html)
    console.log(`  ✓ ${route.pathname} → ${route.outFile}`)
  }

  console.log('Prerender done.')
}

main().catch(err => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
