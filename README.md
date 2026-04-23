# Scribably

> Speech to prompt — fast, simple, no backend.

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)

Scribably is a privacy-focused web app that converts spoken language into clean, usable AI prompts. It follows a three-stage pipeline: raw speech-to-text transcription → automatic text cleanup → prompt generation. Scribably has no backend of its own: the app runs entirely in your browser, and your audio, transcripts, and API keys are never sent to a Scribably server. Requests go directly from your browser to the AI provider you configure (BYOK — bring your own key), so your data only reaches the services you explicitly choose.

## Features

- **Audio input**: Microphone recording or audio file upload
- **Speech-to-Text**: Transcription via Groq, OpenAI, or compatible providers
- **Three-stage processing**: Raw → Cleaned → Prompt
- **Export**: Copy to clipboard, save as `.txt`, `.md`, or LaTeX
- **QR code transfer**: Share your configuration to other devices
- **History**: Browse and re-process previous transcriptions
- **Responsive**: Works on mobile and desktop
- **Dark theme**: Built-in dark mode
- **Plugin API**: Extensible architecture for third-party providers
- **Open source**: Apache-2.0

## Privacy

Scribably is BYOK (bring your own key) and has **no backend**:

- **No Scribably server.** The app is a static web build. There is no account system, no telemetry endpoint, no server-side storage.
- **Direct provider calls.** Audio and text are sent from your browser directly to the STT / LLM provider you configure (Groq, OpenAI, Anthropic, …). What those providers do with your data is governed by *their* terms — pick a provider you trust.
- **Local-only config.** API keys, settings, and the last transcriptions are stored in your browser's `localStorage`. Clear site data to wipe everything.
- **No tracking of content.** Privacy-friendly, cookieless usage analytics (Umami) may be enabled by the operator; it never sees your audio, transcripts, prompts, or keys.

## Setup

### Requirements

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/rico-twe/scribably.git
cd scribably
npm install
npm run dev
```

### API Keys

You'll need at least one API key:

1. **STT provider** (at least one):
   - [Groq API key](https://console.groq.com) (recommended — fast + free tier)
   - [OpenAI API key](https://platform.openai.com)

2. **LLM provider** (optional, for text processing):
   - Any OpenAI-compatible endpoint (OpenAI, Groq, OpenRouter, etc.)
   - [Anthropic API key](https://console.anthropic.com)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + React Testing Library |
| QR | qrcode.react + html5-qrcode |
| Markdown | marked |

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
npx vitest       # Tests in watch mode
npx vitest run   # Run tests once
npm run lint     # Lint
```

## License

Scribably core is licensed under the [Apache License 2.0](./LICENSE).
See [NOTICE](./NOTICE) for attribution requirements.

Optional Pro plugins may be released under a separate commercial license
in the future — the core will remain open source.
