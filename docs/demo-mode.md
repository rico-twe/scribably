# Demo Mode

Scribably ships with an optional public Groq API key, injected at build time. When a visitor opens the app for the first time (empty `localStorage`), this key activates automatically — no sign-up required.

## Build-time configuration

| Variable | Description |
|---|---|
| `VITE_DEMO_GROQ_API_KEY` | Groq API key for the public demo. Injected via GitHub Secret `DEMO_GROQ_API_KEY`. Leave empty to disable demo mode. |

**Security:** This variable is compiled into the public JS bundle. Anyone can extract it. Use a dedicated Groq account with a hard spending cap and — if Groq supports it — an origin restriction.

## Local testing

```sh
# .env.local (git-ignored)
VITE_DEMO_GROQ_API_KEY=gsk_your_test_key_here
```

Then `npm run dev`. The app opens without the Settings drawer.

## Demo constraints

| Limit | Value |
|---|---|
| Recording duration | 30 s (auto-stop) |
| File upload | Trimmed to 30 s via Web Audio API |
| Storage | Demo key is **not** persisted in `localStorage` |

## Providers used

| Role | Provider | Notes |
|---|---|---|
| STT | Groq Whisper (`groq`) | Whisper Large v3 |
| LLM | Groq via OpenAI-compatible | `llama-3.3-70b-versatile` at `https://api.groq.com/openai/v1` |

## Exiting demo mode

When a user enters their own API key in Settings, it is saved to `localStorage` and overrides the demo config. The demo key is no longer used.

To reset back to demo mode: Settings → "Reset to demo mode" (clears `localStorage` and reloads).

## Deployment

In `deploy.yml`, the secret is mapped as:

```yaml
env:
  VITE_DEMO_GROQ_API_KEY: ${{ secrets.DEMO_GROQ_API_KEY }}
```

Set the `DEMO_GROQ_API_KEY` secret in GitHub → Settings → Secrets. Leave it empty to ship without demo mode.
