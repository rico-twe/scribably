# Contributing to WhisperPrompt

## License

WhisperPrompt core is licensed under the **Apache License 2.0**. By submitting a contribution you agree that your code will be released under the same license (inbound = outbound). No separate CLA required.

Optional Pro plugins, if they exist in the future, will live in a separate private repository under a commercial license. Contributions to the core are not affected by this.

## Setup

```bash
git clone <repo-url>
cd whisperprompt
npm install
npm run dev
```

## Tests and lint

```bash
npx vitest run   # Run all tests once
npx vitest       # Watch mode
npm run lint     # ESLint
npm run build    # Type-check + production build
```

All PRs must pass tests and lint. New public APIs, hooks, providers, or services must be documented in `docs/` before the PR is considered complete (see `docs/README.md` for which file covers what).

## Adding a provider

See `docs/providers.md` and `docs/plugin-api.md`. The short version:
1. Create a factory function in `src/providers/transcription/` or `src/providers/text-processing/`
2. Register it in `src/providers/init.ts`
3. Add a co-located test file
4. Update `docs/providers.md`

External providers (not bundled with the core) can register via `src/plugin-api/` without touching the core codebase.

## File header for new source files

New source files don't require a full Apache license header. The `LICENSE` and `NOTICE` files at the repo root cover the whole project. A one-line copyright comment is sufficient if you want attribution:

```ts
// Copyright 2026 WhisperPrompt Contributors. Apache-2.0 license.
```

## What stays open source

Everything in this repository is Apache-2.0. Future Pro features will be developed separately and will not be back-ported into this repo. The core API surface (`src/plugin-api/`) will remain stable and public so third-party plugins can integrate without changes.
