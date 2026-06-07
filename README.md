# Synaphos

**The workspace where intelligence lives on-chain.**

Synaphos is a self-hosted, open-source AI platform built around [Odysseus](https://github.com/synaphos/odysseus). Every AI output can be cryptographically attributed, stored on IPFS, and attested on Base L2 via EAS — creating a permanent, tamper-proof provenance record.

---

## What it is

- **Landing page** — brutalist editorial design, honest about what the platform is and is not
- **Dashboard** — chat UI connecting directly to your local Odysseus backend
- **On-chain layer** — IPFS storage (Pinata) + EAS attestations on Base L2
- **Wallet connect** — Reown AppKit, Base mainnet, dashboard-only

No cloud AI. No API keys. Your model runs on your own machine.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Routing | Wouter |
| On-chain | Ethers.js, EAS SDK, Reown AppKit (WalletConnect) |
| IPFS | Pinata |
| API | Express 5, Drizzle ORM, PostgreSQL |
| Monorepo | pnpm workspaces, TypeScript 5.9 |
| Fonts | Bebas Neue · Space Mono · Inter |

---

## Structure

```
synaphos/
├── artifacts/
│   ├── synaphos/          # Main app — landing page + dashboard
│   └── api-server/        # Express API (Pinata proxy, EAS helpers)
├── lib/                   # Shared TypeScript libraries
└── scripts/               # Utility scripts
```

---

## Running locally

**Prerequisites:** Node.js 24, pnpm 10

```bash
# Install dependencies
pnpm install

# Run the frontend (port auto-assigned)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/synaphos run dev

# Run the API server (port 5000 default)
PORT=5000 BASE_PATH=/api pnpm --filter @workspace/api-server run dev
```

---

## On-chain attestations

When connected to a wallet on Base network, any Odysseus response can be attested:

1. Full conversation uploaded to IPFS via Pinata → returns `CID`
2. EAS attestation created on Base L2 → returns `attestation UID`
3. Permanent record: `wallet + model + IPFS CID + timestamp`

Verify any attestation at [base.easscan.org](https://base.easscan.org).

**Required env vars:**
```bash
PINATA_JWT=your_pinata_jwt_here
```

---

## Odysseus backend

Synaphos connects to [Odysseus](https://github.com/synaphos/odysseus) — a self-hosted local AI backend built on Docker + Ollama.

```bash
# Clone and run Odysseus
git clone https://github.com/synaphos/odysseus
cd odysseus
docker compose up
```

Then set the Odysseus URL in Synaphos Dashboard → Settings.

---

## Design system

- **Aesthetic:** Brutalist editorial — off-white `#EDEBE5`, pure black, red `#CC1100` accents
- **Typography:** Bebas Neue (display) · Space Mono (mono/data) · Inter (body)
- **Layout:** 12-column newspaper grid, horizontal rules, registration marks

---

## Contributing

Contributions welcome. Open an issue or PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Core team:** [Synaphos Dev](https://github.com/synaphos)

---

## License

MIT — see [LICENSE](LICENSE) for details.
