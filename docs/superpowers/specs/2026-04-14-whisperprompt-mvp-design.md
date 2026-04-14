# WhisperPrompt — MVP Design Spec

## Produktüberblick

WhisperPrompt ist eine rein client-seitige Web-App, mit der Nutzer per Spracheingabe Prompts erstellen. Gesprochene Sprache wird transkribiert, intelligent aufbereitet und als kopierbarer, exportierbarer Prompt bereitgestellt.

**Zielgruppe:** Entwickler, Power User, Prompt Engineers, Content Creator — Menschen die unterwegs oder am Desktop schnell aus gesprochener Sprache saubere Prompts erzeugen wollen.

**Kernproblem:** Gesprochene Sprache enthält Füllwörter, Wiederholungen und unstrukturierte Gedanken. Der Weg von "Idee im Kopf" zu "nutzbarer Prompt" ist umständlich.

**Nutzenversprechen:** Schnellster Weg von Sprache zu Prompt — aufnehmen, aufbereiten, kopieren.

## Architekturentscheidungen

| Entscheidung | Wahl | Begründung |
|---|---|---|
| Framework | Vite + React + TypeScript | Kein Backend nötig, leichter Build, perfekt für Static Sites |
| Backend | Keins | Rein client-seitig, API-Calls direkt vom Browser |
| API-Key-Speicherung | localStorage | Keys bleiben auf dem Gerät, BYOK-Modell |
| Config-Transfer | QR-Code Export/Import | Schnelle Übertragung auf andere Geräte |
| STT-Provider | Provider-agnostisch, BYOK | Groq (Prio 1), OpenAI (Prio 2), weitere erweiterbar |
| LLM-Provider | Provider-agnostisch, BYOK, kein Default | Nutzer wählt und konfiguriert selbst |
| Deployment | Static Site (Vercel, Netlify, GitHub Pages) | Kein Server, minimale Kosten |
| Styling | Tailwind CSS | Utility-first, responsive, schnelle Iteration |

## Provider-Architektur

### TranscriptionProvider Interface

```typescript
interface TranscriptionProvider {
  id: string;
  name: string;
  transcribe(audio: Blob, options: TranscriptionOptions): Promise<TranscriptionResult>;
}

interface TranscriptionOptions {
  language: string;        // z.B. "de"
  model?: string;          // z.B. "whisper-large-v3"
}

interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;        // Audio-Dauer in Sekunden
}
```

### TextProcessingProvider Interface

```typescript
interface TextProcessingProvider {
  id: string;
  name: string;
  process(text: string, options: ProcessingOptions): Promise<ProcessingResult>;
}

interface ProcessingOptions {
  mode: 'clean' | 'prompt';
  language: string;
  customSystemPrompt?: string;
}

interface ProcessingResult {
  text: string;
  tokensUsed?: number;
}
```

### Provider-Implementierungsreihenfolge

**STT:**
1. Groq (Whisper Large v3) — schnellste, günstigste Option mit hervorragender Deutsch-Qualität
2. OpenAI (Whisper) — bewährte Alternative
3. Weitere via gleicher Interface-Abstraktion

**LLM:**
- Kein Default-Provider. Nutzer konfiguriert seinen bevorzugten Provider.
- Alle Provider implementieren dasselbe `TextProcessingProvider` Interface.
- MVP-Implementierungen: OpenAI-kompatible API (deckt OpenAI, Groq, OpenRouter etc. ab), Anthropic API.

## Datenfluss

```
Mikrofon/Upload
      ↓
  AudioBlob (WebM/WAV)
      ↓
  TranscriptionProvider (Groq/OpenAI/...) ← API-Key aus localStorage
      ↓
  Rohtext
      ↓
  TextProcessingProvider (Claude/GPT/...) ← API-Key aus localStorage
      ↓         ↓
  "Bereinigt"  "Prompt-Version"
      ↓         ↓
  Export (Copy / .txt / .md)
```

## UI-Design

### Layout-Entscheidungen

| Kontext | Layout | Begründung |
|---|---|---|
| Mobile | Einzelspalte, Aufnahme-Button unten | Daumenzone, Chat-App-Pattern |
| Desktop | Zwei-Spalten (Eingabe links, Ergebnis rechts) | Parallele Sichtbarkeit von Input/Output |
| Einstellungen | Slide-Over Panel von rechts | Kein Kontextwechsel, schnell öffnen/schließen |
| Responsive-Breakpoint | 768px | Desktop ab md, Mobile darunter |

### Design-Prinzipien

- Dark Theme als Default (Zielgruppe: Entwickler)
- Minimalistisch, kein visuelles Rauschen
- Klare Status-Kommunikation (Idle → Aufnahme → Verarbeitung → Fertig → Fehler)
- Akzentfarbe: Rot für Aufnahme-Button (universelles Aufnahme-Signal)
- Indigo/Violett für interaktive Elemente und Highlights

### Screens und Zustände

**Hauptansicht (Mobile):**
- Oberer Bereich: Ergebnis mit Tabs (Rohtext / Bereinigt / Prompt)
- Export-Buttons unter dem Ergebnis
- Unterer Bereich: Aufnahme-Button (prominent, zentriert)
- Settings-Icon oben rechts

**Hauptansicht (Desktop):**
- Header: Logo + Settings-Icon
- Linke Spalte: Aufnahme-Button, Upload-Zone, Rohtext-Vorschau
- Rechte Spalte: Tabs (Bereinigt / Prompt), Export-Buttons

**Einstellungen (Slide-Over):**
- STT-Provider Dropdown + API-Key Input
- LLM-Provider Dropdown + API-Key Input
- Sprache Dropdown (Default: Deutsch)
- QR-Code für Config-Export
- QR-Scanner für Config-Import

**Zustände des Aufnahme-Buttons:**
1. **Idle** — roter Kreis mit weißem Punkt, "Tippe zum Aufnehmen"
2. **Aufnahme läuft** — pulsierender roter Kreis, Waveform-Animation, Timer
3. **Verarbeitung** — Spinner/Loading-Indikator
4. **Fertig** — Ergebnis erscheint in den Tabs
5. **Fehler** — Fehlermeldung mit Retry-Option

### Onboarding / Erstnutzung

Beim ersten Besuch (keine API-Keys konfiguriert):
- Einstellungen-Panel öffnet automatisch
- Kurzer Hinweis: "Konfiguriere mindestens einen STT-Provider um loszulegen"
- Provider-Auswahl mit Links zur API-Key-Erstellung

## Komponentenstruktur

```
src/
├── components/
│   ├── AudioRecorder.tsx        — Mikrofon-Aufnahme + Upload
│   ├── RecordButton.tsx         — Aufnahme-Button mit Zuständen
│   ├── TranscriptionResult.tsx  — Tabs mit Rohtext/Bereinigt/Prompt
│   ├── ExportBar.tsx            — Copy/Download Buttons
│   ├── SettingsPanel.tsx        — Slide-Over für Einstellungen
│   ├── ProviderConfig.tsx       — Provider-Auswahl + API-Key
│   ├── QRCodeTransfer.tsx       — QR-Code Export/Import
│   └── StatusIndicator.tsx      — Aufnahme/Verarbeitungs-Status
├── providers/
│   ├── transcription/
│   │   ├── types.ts             — TranscriptionProvider Interface
│   │   ├── registry.ts          — Provider-Registry
│   │   ├── groq.ts              — Groq Whisper Implementation
│   │   └── openai-whisper.ts    — OpenAI Whisper Implementation
│   └── text-processing/
│       ├── types.ts             — TextProcessingProvider Interface
│       ├── registry.ts          — Provider-Registry
│       ├── openai-compatible.ts — OpenAI/Groq/OpenRouter etc.
│       └── anthropic.ts         — Claude API Implementation
├── services/
│   ├── audio.ts                 — Audio-Aufnahme Logik (MediaRecorder)
│   ├── transcription.ts         — Orchestriert Provider-Aufruf
│   ├── text-processing.ts       — Orchestriert LLM-Aufbereitung
│   └── config.ts                — localStorage Lesen/Schreiben/QR
├── hooks/
│   ├── useAudioRecorder.ts      — React Hook für Aufnahme
│   ├── useTranscription.ts      — React Hook für STT
│   └── useTextProcessing.ts     — React Hook für LLM
├── App.tsx
├── main.tsx
└── index.css
```

## MVP-Scope

### In-Scope

1. Mikrofon-Aufnahme im Browser (MediaRecorder API)
2. Audio-Datei-Upload (Drag & Drop + File Picker)
3. Transkription via Groq (Prio 1) und OpenAI (Prio 2)
4. Text-Aufbereitung: "Bereinigt" und "Prompt-Version" via LLM
5. Ergebnis-Tabs: Rohtext / Bereinigt / Prompt
6. Export: Clipboard, .txt, .md Download
7. Einstellungen: Provider-Wahl, API-Keys, Sprache
8. QR-Code Config-Transfer
9. Responsive: Mobile-First + Desktop Zwei-Spalten
10. Dark Theme
11. Deutsch als Standard-Sprache

### Out-of-Scope (Post-MVP)

- Prompt-Vorlagen
- Verlauf / Historie
- PWA / Offline
- Lokale Whisper-Unterstützung
- Direkte Integrationen (Claude Code, Cursor)
- Light Theme
- Mehrsprachige UI
- Benutzerdefinierte Prompt-Stile
- Audio-Streaming (Echtzeit-Transkription)

## Datenschutz und Sicherheit

- **Kein Backend:** Audio und Text verlassen den Browser nur in Richtung der vom Nutzer konfigurierten APIs.
- **API-Keys in localStorage:** Bleiben auf dem Gerät. Werden nur für direkte API-Calls verwendet.
- **QR-Code Transfer:** Enthält Base64-kodierte Config-Daten (nicht verschlüsselt). Kein Server involviert. Warnung in der UI dass API-Keys im QR-Code enthalten sind.
- **Keine Telemetrie, kein Tracking** im MVP.
- **Open-Source-Lizenz:** MIT — maximale Freiheit für die Community.

## Technische Details

### Audio-Aufnahme
- `MediaRecorder` API mit `audio/webm;codecs=opus` (breite Browser-Unterstützung)
- Fallback auf `audio/wav` wenn WebM nicht unterstützt
- Max-Aufnahmedauer: 5 Minuten (API-Limits + UX)

### Prompts für Text-Aufbereitung

**Clean-Modus (Bereinigt):**
System-Prompt der Füllwörter entfernt, Grammatik korrigiert, gesprochene Sprache in Schriftsprache umwandelt — aber den Inhalt nicht verändert.

**Prompt-Modus:**
System-Prompt der den bereinigten Text in einen strukturierten, klar formulierten Prompt umwandelt — mit Kontext, Ziel und Erwartungen.

### QR-Code
- Library: `qrcode.react` für Generierung, `html5-qrcode` für Scanning
- Payload: JSON mit Provider-IDs, API-Keys, Sprache — Base64-kodiert
- Sensible Daten (API-Keys) im QR-Code: Nutzer muss bewusst teilen (Warnung in UI)
