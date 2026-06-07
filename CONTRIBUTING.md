# Contributing to Synaphos

Thanks for your interest in contributing.

## How to contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes with clear messages
4. Push and open a pull request

## Development setup

```bash
pnpm install
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/synaphos run dev
PORT=5000 BASE_PATH=/api pnpm --filter @workspace/api-server run dev
```

## Code style

- TypeScript strict mode everywhere
- No `console.log` in server code — use the `logger` singleton
- Brutalist editorial design system — no emojis in UI
- Honest copy — no misleading claims about AI capabilities

## Reporting issues

Open a GitHub issue with:
- Clear description of the bug or feature request
- Steps to reproduce (for bugs)
- Environment details (OS, Node version, browser)

## Core team

- [Synaphos Dev](https://github.com/synaphos)
