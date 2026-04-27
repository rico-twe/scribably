# AGENTS.md

Cross-agent context for Scribably. See `README.md` for user-facing documentation.

## Build commands

```sh
npm run dev       # Development server
npm run build     # TypeScript check + Vite build + prerender
npx vitest run    # Run all tests
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

## Build-time environment variables

| Variable | GitHub Secret | Description |
|---|---|---|
| `VITE_UMAMI_SRC` | `UMAMI_SRC` | Umami analytics script URL |
| `VITE_UMAMI_WEBSITE_ID` | `UMAMI_WEBSITE_ID` | Umami site ID |
| `VITE_UMAMI_DOMAINS` | `UMAMI_DOMAINS` | Umami domain allowlist |
| `VITE_DEMO_GROQ_API_KEY` | `DEMO_GROQ_API_KEY` | Public demo key (visible in bundle — use a spending-capped key) |

See `docs/demo-mode.md` for demo mode architecture.
See `docs/analytics.md` for Umami setup (on branch `feat/15_detected-language`, pending merge).
