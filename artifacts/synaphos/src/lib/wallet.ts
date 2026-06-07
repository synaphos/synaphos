import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { base } from "@reown/appkit/networks";

export const REOWN_PROJECT_ID =
  (import.meta.env.VITE_REOWN_PROJECT_ID as string) ||
  "e09d8f3c4a88afe1aa715840d9d8b690";

const networks = [base] as const;

export const wagmiAdapter = new WagmiAdapter({
  projectId: REOWN_PROJECT_ID,
  networks,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: base,
  projectId: REOWN_PROJECT_ID,
  metadata: {
    name: "Synaphos",
    description:
      "Self-hosted local AI workspace built on Odysseus. On-chain provenance on Base.",
    url: "https://synaphos.com",
    icons: ["https://synaphos.com/favicon.png"],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
    swaps: false,
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-color-mix": "#EDEBE5",
    "--w3m-color-mix-strength": 0,
    "--w3m-accent": "#CC1100",
    "--w3m-border-radius-master": "0px",
    "--w3m-font-family": "'Space Mono', monospace",
  },
});

export { base };
