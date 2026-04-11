# WhisperPrompt

Sprache zu Prompt — schnell, einfach, lokal.

WhisperPrompt ist eine Web-App, die gesprochene Sprache in saubere, verwendbare Prompts umwandelt. Rein client-seitig — keine Daten werden auf einem Server gespeichert.

## Features

- Mikrofon-Aufnahme oder Audio-Datei-Upload
- Speech-to-Text via Groq, OpenAI oder andere Provider
- Automatische Text-Aufbereitung: Rohtext → Bereinigt → Prompt
- Export: Clipboard, .txt, .md
- Konfiguration via QR-Code auf andere Geräte übertragen
- Responsive: Mobile + Desktop
- Dark Theme
- Open Source (MIT)

## Setup

### Voraussetzungen

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

WhisperPrompt speichert keine Keys auf Servern. Du brauchst:

1. **STT-Provider** (mindestens einen):
   - [Groq API Key](https://console.groq.com) (empfohlen — schnell + günstig)
   - [OpenAI API Key](https://platform.openai.com)

2. **LLM-Provider** (optional, für Text-Aufbereitung):
   - Jeder OpenAI-kompatible Endpoint (OpenAI, Groq, OpenRouter, etc.)
   - [Anthropic API Key](https://console.anthropic.com)

Keys werden im localStorage deines Browsers gespeichert.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS 4
- Vitest + React Testing Library
- qrcode.react

## Entwicklung

```bash
npm run dev      # Dev-Server starten
npm run build    # Production Build
npm run preview  # Build-Vorschau
npx vitest       # Tests im Watch-Mode
npx vitest run   # Tests einmalig
```

## Lizenz

MIT
