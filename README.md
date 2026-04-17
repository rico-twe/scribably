# WhisperPrompt

Speech to prompt — fast, simple, local.

WhisperPrompt is a web app that turns spoken language into clean, usable prompts. Purely client-side — no data is stored on a server.

## Features

- Microphone recording or audio file upload
- Speech-to-Text via Groq, OpenAI, or other providers
- Automatic text processing: Raw → Cleaned → Prompt
- Export: Clipboard, .txt, .md
- Transfer config to other devices via QR code
- Responsive: mobile + desktop
- Dark theme
- Open source (MIT)

## Setup

### Requirements

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd whisperprompt
npm install
npm run dev
```

### API Keys

WhisperPrompt does not store keys on servers. You need:

1. **STT provider** (at least one):
   - [Groq API key](https://console.groq.com) (recommended — fast + cheap)
   - [OpenAI API key](https://platform.openai.com)

2. **LLM provider** (optional, for text processing):
   - Any OpenAI-compatible endpoint (OpenAI, Groq, OpenRouter, etc.)
   - [Anthropic API key](https://console.anthropic.com)

Keys are stored in your browser's localStorage.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS 4
- Vitest + React Testing Library
- qrcode.react

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npx vitest       # Tests in watch mode
npx vitest run   # Run tests once
```

## License

MIT
