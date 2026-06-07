import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import logoPath from "@assets/c22b81f9-1cbb-424a-a4a2-351d436277e6_1780786137788.png";

const navLinks = [
  { name: "HOW IT WORKS", href: "#architecture" },
  { name: "FEATURES", href: "#features" },
  { name: "GET STARTED", href: "#start" },
  { name: "ROADMAP", href: "#roadmap" },
  { name: "STACK", href: "#stack" },
];

const terminalLines = [
  { text: "$ git clone https://github.com/synaphos/synaphos", red: true },
  { text: "> Cloning Odysseus AI core...", red: false },
  { text: "$ docker compose up -d", red: true },
  { text: "> Starting Odysseus FastAPI backend... OK", red: false },
  { text: "> Starting ChromaDB vector memory... OK", red: false },
  { text: "> Starting Synaphos UI... OK", red: false },
  { text: "> All services healthy.", red: false },
  { text: "> Open http://localhost:3000 in your browser.", red: false },
];

function TerminalLine({
  text,
  red,
  delay,
}: {
  text: string;
  red: boolean;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
      className="font-mono text-[11px] leading-6 break-all"
      style={{ color: red ? "#CC1100" : "#0A0A0A" }}
    >
      {text}
    </motion.div>
  );
}

const features = [
  {
    code: "F.01",
    title: "ZERO CLOUD",
    desc: "Runs entirely on your machine. Supports Ollama, llama.cpp, vLLM, or any OpenAI-compatible local endpoint. No API key. Your data never leaves your device.",
    stat: "100%",
    note: "LOCAL INFERENCE",
    live: true,
  },
  {
    code: "F.02",
    title: "AGENT WORKSPACE",
    desc: "Full ReAct-style agent loop with tool dispatch, ChromaDB vector memory, multi-step research planner, and model management — all running locally on Odysseus core.",
    stat: "REACT",
    note: "AGENT LOOP",
    live: true,
  },
  {
    code: "F.03",
    title: "MULTI-MODEL SUPPORT",
    desc: "Switch between Llama, Mistral, Gemma, Phi, or any GGUF model. Odysseus abstracts the model layer — swap providers without changing your workflow.",
    stat: "ANY",
    note: "LOCAL MODEL",
    live: true,
  },
  {
    code: "F.04",
    title: "AI PROVENANCE",
    desc: "Every AI output will be SHA-256 hashed and attested on Base via a smart contract. Anyone can verify that a specific output is genuine — permanently. Phase 2 roadmap.",
    stat: "SOON",
    note: "BASE L2 · ROADMAP",
    live: false,
  },
  {
    code: "F.05",
    title: "WALLET AUTH (SIWE)",
    desc: "Sign-In With Ethereum will replace username/password for on-chain sessions. Sign a human-readable EIP-4361 message in your local wallet. Phase 2 roadmap.",
    stat: "SOON",
    note: "EIP-4361 · ROADMAP",
    live: false,
  },
  {
    code: "F.06",
    title: "IPFS STORAGE",
    desc: "AI-generated documents and outputs will be stored on IPFS via a local Kubo node, with CID anchored on-chain. You own your data. Phase 2 roadmap.",
    stat: "SOON",
    note: "IPFS · ROADMAP",
    live: false,
  },
];

const layers = [
  {
    id: "L1",
    label: "FRONTEND (LOCAL UI)",
    detail:
      "Synaphos web UI · Chat, agents, model manager · Runs at localhost:3000",
    live: true,
  },
  {
    id: "L2",
    label: "CORE AI — ODYSSEUS",
    detail:
      "FastAPI · LLM abstraction · ReAct agent loop · ChromaDB vector memory · Multi-model",
    live: true,
  },
  {
    id: "L3",
    label: "SERVICES",
    detail:
      "Notes · Model server · Ollama bridge · GPU allocation · Local embedding",
    live: true,
  },
  {
    id: "L4",
    label: "ON-CHAIN LAYER",
    detail:
      "SIWE auth · AI provenance attestation · IPFS anchoring · Base L2 — Phase 2 roadmap",
    live: false,
  },
  {
    id: "L5",
    label: "INFRA",
    detail:
      "Docker Compose · SQLite · ChromaDB · Hardhat (Phase 2) · Alchemy RPC (Phase 2)",
    live: true,
  },
];

const steps = [
  {
    num: "01",
    title: "CLONE THE REPO",
    code: "git clone https://github.com/synaphos/synaphos\ncd synaphos",
    note: "Requires Git and Docker. Works on Linux, macOS, Windows WSL.",
  },
  {
    num: "02",
    title: "START WITH DOCKER",
    code: "docker compose up -d\n# Starts Odysseus AI core + Synaphos UI",
    note: "Docker Compose v2+ required. All services start automatically.",
  },
  {
    num: "03",
    title: "OPEN THE WORKSPACE",
    code: "# Open your browser:\nhttp://localhost:3000",
    note: "The full local AI workspace is running. No account, no cloud, no API key needed.",
  },
];

const techStack = [
  "Python 3.11",
  "FastAPI",
  "Odysseus Core",
  "ChromaDB",
  "fastembed",
  "Ollama",
  "Docker Compose",
  "SQLite",
  "React + Vite",
  "Tailwind CSS",
  "TypeScript",
  "Framer Motion",
];

const roadmapItems = [
  {
    phase: "NOW",
    label: "LOCAL AI WORKSPACE",
    items: [
      "Odysseus core integration",
      "Multi-model support (Ollama, llama.cpp)",
      "ReAct agent loop",
      "ChromaDB vector memory",
      "Docker Compose one-command setup",
    ],
    done: true,
  },
  {
    phase: "PHASE 2",
    label: "ON-CHAIN LAYER",
    items: [
      "SIWE wallet auth (local app only)",
      "ProvenanceRegistry contract on Base",
      "SHA-256 output hashing",
      "IPFS output storage (Kubo)",
      "On-chain CID anchoring",
    ],
    done: false,
  },
  {
    phase: "PHASE 3",
    label: "ADVANCED AGENTS",
    items: [
      "MCP tool panel",
      "Email triage agent",
      "CalDAV sync",
      "Multi-agent coordination",
      "Custom tool registry",
    ],
    done: false,
  },
];

const marqueeItems = [
  "SELF-HOSTED",
  "ZERO CLOUD",
  "LOCAL AI",
  "ODYSSEUS CORE",
  "OPEN SOURCE",
  "MIT LICENSE",
  "DOCKER COMPOSE",
  "MULTI-MODEL",
  "BASE — ROADMAP",
  "NO API KEY",
];

export default function Home() {
  const [time, setTime] = useState(
    new Date().toISOString().split("T")[1].split(".")[0]
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(
      () => setTime(new Date().toISOString().split("T")[1].split(".")[0]),
      1000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 28s linear infinite;
        }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
        <div className="flex items-center justify-between px-4 md:px-8 h-12">
          <div className="flex items-center gap-2">
            <img
              src={logoPath}
              alt="Synaphos"
              className="w-7 h-7 flex-shrink-0 object-contain"
            />
            <span className="font-display text-xl tracking-wider">
              SYNAPHOS
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="font-mono text-[10px] tracking-widest hover:text-primary transition-colors"
              >
                {l.name}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="font-mono text-[9px] md:text-[10px] tracking-widest bg-foreground text-background px-3 md:px-4 py-1.5 hover:bg-primary transition-colors whitespace-nowrap flex items-center gap-1"
            >
              DASHBOARD <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/synaphos"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex font-mono text-[9px] md:text-[10px] tracking-widest border-2 border-foreground px-3 md:px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors whitespace-nowrap items-center gap-1"
            >
              GITHUB <ArrowUpRight className="w-3 h-3" />
            </a>
            <button
              className="lg:hidden border-2 border-foreground p-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t-2 border-foreground bg-background">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block font-mono text-[11px] tracking-widest px-4 py-3 border-b border-foreground/20 hover:bg-foreground hover:text-background transition-colors"
              >
                {l.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* TICKER */}
      <div className="border-b border-foreground overflow-hidden py-1.5">
        <div className="marquee-track gap-0">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="font-mono text-[9px] md:text-[10px] tracking-widest flex items-center gap-2 whitespace-nowrap px-6"
            >
              <span className="w-1.5 h-1.5 bg-primary inline-block flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* HERO — DESKTOP */}
      <section className="border-b-2 border-foreground hidden lg:grid grid-cols-12 min-h-[88vh]">
        <div className="col-span-1 border-r-2 border-foreground flex flex-col items-center justify-between py-8 px-2">
          <span
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground"
          >
            SYNAPHOS.COM
          </span>
          <span
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground"
          >
            LOCAL AI · OPEN SOURCE
          </span>
        </div>
        <div className="col-span-7 flex flex-col border-r-2 border-foreground">
          <div className="border-b-2 border-foreground px-6 py-2 flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-widest">
              STATUS: <span className="text-primary">ACTIVE</span>
              <span className="text-muted-foreground ml-3">
                · BUILT ON ODYSSEUS
              </span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              {time} UTC
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="px-6 pt-8 pb-4 flex-1 flex flex-col justify-center"
          >
            <div className="font-mono text-[9px] tracking-widest text-primary mb-4 uppercase">
              Built on Odysseus · Self-Hosted · Open Source · MIT
            </div>
            <div className="font-display leading-[0.9] text-[clamp(3.5rem,7vw,8rem)] uppercase mb-6">
              YOUR AI.
              <br />
              YOUR MACHINE.
              <br />
              YOUR <span className="text-primary">DATA.</span>
            </div>
            <div className="h-px bg-foreground mb-6 mt-2" />
            <p className="font-mono text-[11px] leading-5 text-muted-foreground max-w-lg">
              Synaphos is a self-hosted local AI workspace built on the
              Odysseus framework. Run any LLM on your own hardware — no cloud,
              no API key, no middleman. On-chain provenance on Base is on the
              roadmap.
            </p>
          </motion.div>
          <div className="border-t-2 border-foreground px-6 py-4 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/synaphos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest bg-foreground text-background px-6 py-3 flex items-center gap-2 hover:bg-primary transition-colors"
            >
              SELF-HOST FREE <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="#architecture"
              className="font-mono text-xs tracking-widest border-2 border-foreground px-6 py-3 flex items-center gap-2 hover:bg-foreground hover:text-background transition-colors"
            >
              HOW IT WORKS <ArrowRight className="w-3 h-3" />
            </a>
            <span className="font-mono text-[9px] text-muted-foreground ml-auto tracking-widest">
              MIT · OPEN SOURCE
            </span>
          </div>
        </div>
        <div className="col-span-4 flex flex-col">
          <div className="border-b-2 border-foreground px-4 py-2">
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              SYNAPHOS · LOCAL WORKSPACE
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute w-[280px] h-[280px] rounded-full border border-foreground/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute w-[220px] h-[220px] rounded-full border border-foreground/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
              {[0, 90, 180, 270].map((deg) => (
                <motion.div
                  key={deg}
                  className="absolute w-[280px] h-[280px]"
                  style={{ rotate: deg }}
                  animate={{ rotate: deg + 360 }}
                  transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary opacity-60" />
                </motion.div>
              ))}
              <motion.img
                src={logoPath}
                alt="Synaphos"
                className="w-36 h-36 object-contain relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>
            <div className="w-full space-y-2">
              {[
                { label: "INFERENCE", val: "100% LOCAL" },
                { label: "CLOUD COST", val: "$0.00" },
                { label: "LICENSE", val: "MIT" },
                { label: "ON-CHAIN", val: "ROADMAP" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center border-b border-foreground/20 pb-1"
                >
                  <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] tracking-widest">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t-2 border-foreground p-4">
            <div className="bg-foreground text-background p-3">
              <div className="font-mono text-[8px] tracking-widest text-background/50 mb-1">
                POWERED BY
              </div>
              <div className="font-display text-3xl">ODYSSEUS CORE</div>
              <div className="font-mono text-[8px] tracking-widest text-background/50 mt-1">
                LOCAL AI FRAMEWORK · OPEN SOURCE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO — MOBILE */}
      <section className="border-b-2 border-foreground lg:hidden flex flex-col">
        <div className="border-b-2 border-foreground px-4 py-2 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest">
            STATUS: <span className="text-primary">ACTIVE</span>
          </span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            {time} UTC
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="px-4 pt-8 pb-4"
        >
          <div className="font-mono text-[9px] tracking-widest text-primary mb-3">
            BUILT ON ODYSSEUS · SELF-HOSTED · MIT
          </div>
          <div className="font-display leading-[0.9] text-[clamp(3.2rem,14vw,5.5rem)] uppercase mb-5">
            YOUR AI.
            <br />
            YOUR MACHINE.
            <br />
            YOUR <span className="text-primary">DATA.</span>
          </div>
          <div className="h-px bg-foreground mb-4 mt-3" />
          <p className="font-mono text-[11px] leading-5 text-muted-foreground">
            Synaphos is a self-hosted local AI workspace built on Odysseus. Run
            any LLM on your own hardware. No cloud. No API key. On-chain
            provenance is on the roadmap.
          </p>
        </motion.div>
        <div className="border-t-2 border-foreground px-4 py-4 flex flex-col gap-3">
          <a
            href="https://github.com/synaphos"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-mono text-xs tracking-widest bg-foreground text-background py-3 flex items-center justify-center gap-2 hover:bg-primary transition-colors"
          >
            SELF-HOST FREE <ArrowUpRight className="w-3 h-3" />
          </a>
          <a
            href="#architecture"
            className="w-full font-mono text-xs tracking-widest border-2 border-foreground py-3 flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors"
          >
            HOW IT WORKS <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>

      <div className="border-b-4 border-foreground" />

      {/* HOW IT WORKS */}
      <section id="architecture" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="font-display text-3xl md:text-4xl">
            HOW IT WORKS
          </span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            ODYSSEUS CORE · ON-CHAIN LAYER COMING
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
          <div>
            {layers.map((layer, i) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-b-2 border-foreground px-4 md:px-8 py-4 flex items-start gap-4"
              >
                <div className="w-12 flex-shrink-0">
                  <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    {layer.id}
                  </div>
                  {layer.live ? (
                    <div className="w-2 h-2 bg-foreground mt-1" />
                  ) : (
                    <div className="font-mono text-[7px] tracking-widest text-primary mt-1">
                      ROADMAP
                    </div>
                  )}
                </div>
                <div>
                  <div
                    className={`font-display text-xl md:text-2xl mb-1 ${!layer.live ? "opacity-50" : ""}`}
                  >
                    {layer.label}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground leading-4">
                    {layer.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-4">
                THE CONCEPT
              </div>
              <div className="font-display text-4xl md:text-5xl leading-tight mb-6">
                LOCAL AI.
                <br />
                <span className="text-primary">YOUR RULES.</span>
                <br />
                YOUR DATA.
              </div>
              <div className="h-px bg-foreground mb-4" />
              <p className="font-mono text-[10px] leading-5 text-muted-foreground mb-4">
                Odysseus is the battle-tested local AI core — FastAPI backend,
                ReAct agent loop, ChromaDB vector memory, multi-model support.
                Synaphos wraps it with a clean UI and Docker setup.
              </p>
              <p className="font-mono text-[10px] leading-5 text-muted-foreground">
                The on-chain layer — SIWE auth, Base attestation, IPFS storage —
                is on the roadmap. When it ships, it lives inside your local
                app. Not on this website.
              </p>
            </div>
            <div className="border-2 border-foreground/20 p-4 bg-foreground/5">
              <div className="font-mono text-[8px] tracking-widest mb-3 text-muted-foreground">
                PHASE 2 · COMING NEXT
              </div>
              {[
                "ProvenanceRegistry.sol — Base L2 attestation contract",
                "IPFS Kubo node — local decentralized storage",
                "SIWE — wallet auth inside local app only",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-0.5">
                  <div className="w-1 h-1 border border-primary flex-shrink-0" />
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="font-display text-3xl md:text-4xl">
            CORE FEATURES
          </span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            LIVE NOW · ROADMAP CLEARLY LABELED
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.code}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className={`p-5 md:p-6 border-b-2 border-foreground ${!f.live ? "opacity-55" : ""}`}
              style={{
                borderRight:
                  (i % 2 === 0 ? "2px solid #0D0D0D" : "none"),
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    {f.code}
                  </span>
                  {!f.live && (
                    <span className="font-mono text-[7px] tracking-widest border border-primary/60 text-primary px-1 py-0.5">
                      ROADMAP
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-display text-xl md:text-2xl text-primary">
                    {f.stat}
                  </div>
                  <div className="font-mono text-[8px] tracking-wider text-muted-foreground">
                    {f.note}
                  </div>
                </div>
              </div>
              <div className="h-px bg-foreground mb-3" />
              <div className="font-display text-lg md:text-xl mb-2">
                {f.title}
              </div>
              <p className="font-mono text-[10px] leading-[1.6] text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TERMINAL */}
      <section className="border-b-2 border-foreground grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
        <div className="p-6 md:p-8 flex flex-col justify-between gap-6 order-2 md:order-1">
          <div>
            <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-2">
              GETTING STARTED
            </div>
            <div className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-tight mb-4">
              THREE
              <br />
              COMMANDS.
              <br />
              <span className="text-primary">RUNNING.</span>
            </div>
            <div className="h-px bg-foreground mb-4" />
            <p className="font-mono text-[10px] leading-5 text-muted-foreground">
              Clone the repo, run Docker Compose, open localhost:3000. The full
              Odysseus AI workspace runs on your machine in minutes.
            </p>
          </div>
          <a
            href="https://github.com/synaphos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest border-2 border-foreground px-4 py-2 flex items-center gap-2 w-fit hover:bg-foreground hover:text-background transition-colors"
          >
            VIEW ON GITHUB <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="order-1 md:order-2">
          <div className="border-b-2 border-foreground px-4 md:px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary" />
              <div className="w-2 h-2 border border-foreground" />
              <div className="w-2 h-2 border border-foreground" />
            </div>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              TERMINAL · SETUP FLOW
            </span>
          </div>
          <div className="p-4 md:p-6 min-h-[280px] md:min-h-[380px] flex flex-col">
            {terminalLines.map((line, i) => (
              <TerminalLine
                key={i}
                text={line.text}
                red={line.red}
                delay={i * 0.25}
              />
            ))}
            <div className="font-mono text-xs mt-2 text-foreground flex items-center">
              <span>{"$ "}</span>
              <span className="blink">▌</span>
            </div>
          </div>
        </div>
      </section>

      {/* GET STARTED */}
      <section id="start" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="font-display text-3xl md:text-4xl">GET STARTED</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            3 COMMANDS · SELF-HOSTED · ZERO CLOUD
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col"
            >
              <div className="border-b-2 border-foreground px-5 md:px-6 py-3 flex items-center justify-between">
                <span className="font-display text-5xl md:text-6xl text-primary leading-none">
                  {step.num}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                  {step.title}
                </span>
              </div>
              <div className="p-5 md:p-6 flex-1 flex flex-col gap-4">
                <div className="font-display text-xl md:text-2xl">
                  {step.title}
                </div>
                <div className="bg-foreground text-background p-3 md:p-4">
                  {step.code.split("\n").map((line, j) => (
                    <div
                      key={j}
                      className={`font-mono text-[10px] leading-5 break-all ${line.startsWith("#") ? "opacity-40" : ""}`}
                    >
                      {!line.startsWith("#") && (
                        <span className="text-primary mr-1">$</span>
                      )}
                      {line}
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[10px] leading-5 text-muted-foreground">
                  {step.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t-2 border-foreground grid grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-foreground">
          {[
            { label: "MINIMUM HARDWARE", val: "8GB RAM · GPU optional" },
            { label: "DOCKER REQUIRED", val: "v24+ · Compose v2+" },
            { label: "ON-CHAIN", val: "Phase 2 — Roadmap" },
          ].map((item) => (
            <div
              key={item.label}
              className="px-5 md:px-8 py-4 flex items-center justify-between gap-4"
            >
              <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                {item.label}
              </span>
              <span className="font-mono text-[10px] font-bold text-right">
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="font-display text-3xl md:text-4xl">ROADMAP</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            WHAT IS LIVE · WHAT IS COMING
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-foreground">
          {roadmapItems.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 md:p-6 flex flex-col gap-4 ${!phase.done ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[8px] tracking-widest border px-2 py-0.5 ${
                    phase.done
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/30 text-muted-foreground"
                  }`}
                >
                  {phase.phase}
                </span>
                {phase.done && <div className="w-2 h-2 bg-primary" />}
              </div>
              <div className="font-display text-xl md:text-2xl">
                {phase.label}
              </div>
              <div className="h-px bg-foreground/20" />
              <ul className="flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div
                      className={`w-1.5 h-1.5 flex-shrink-0 mt-1 ${
                        phase.done
                          ? "bg-foreground"
                          : "border border-foreground/30"
                      }`}
                    />
                    <span className="font-mono text-[10px] leading-5 text-muted-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section id="stack" className="border-b-2 border-foreground">
        <div className="border-b-2 border-foreground px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="font-display text-3xl md:text-4xl">TECH STACK</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            PYTHON · DOCKER · ODYSSEUS CORE
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="border-b border-r border-foreground/20 px-4 py-3 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-foreground flex-shrink-0" />
              <span className="font-mono text-[10px] tracking-wider">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="github"
        className="border-b-2 border-foreground bg-foreground text-background px-6 md:px-8 py-10 md:py-14"
      >
        <div className="max-w-4xl">
          <div className="font-mono text-[9px] tracking-widest text-background/50 mb-3">
            SELF-HOSTED · OPEN SOURCE · MIT · BUILT ON ODYSSEUS
          </div>
          <div className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-tight mb-6">
            RUN IT LOCAL.
            <br />
            OWN YOUR <span className="text-primary">DATA.</span>
          </div>
          <p className="font-mono text-[11px] leading-5 text-background/70 max-w-xl mb-8">
            Clone Synaphos, run Docker Compose, and you have a full local AI
            workspace in minutes. On-chain provenance on Base is coming. Follow
            the roadmap on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/pewdiepie-archdaemon/odysseus"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest border-2 border-background px-6 py-3 flex items-center justify-center gap-2 hover:bg-background hover:text-foreground transition-colors"
            >
              ODYSSEUS CORE <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/synaphos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-widest bg-primary text-background px-6 py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              GITHUB — SYNAPHOS <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-foreground">
        <div className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-foreground">
          <div className="col-span-2 md:col-span-1 p-6 border-b-2 md:border-b-0 md:border-r-2 border-foreground flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={logoPath}
                alt="Synaphos"
                className="w-6 h-6 flex-shrink-0 object-contain"
              />
              <span className="font-display text-lg tracking-wider">
                SYNAPHOS
              </span>
            </div>
            <p className="font-mono text-[9px] leading-[1.7] text-muted-foreground">
              Self-hosted local AI workspace built on Odysseus. On-chain
              provenance on Base — roadmap. MIT license.
            </p>
            <div className="flex items-center gap-2 mt-auto">
              <a
                href="https://github.com/synaphos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] tracking-widest border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors flex items-center gap-1"
              >
                GITHUB <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://x.com/Synaphos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] tracking-widest border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors flex items-center gap-1"
              >
                X.COM <ArrowUpRight className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
          <div className="p-6 border-b-2 md:border-b-0 border-r-2 border-foreground">
            <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-4">
              DOCS
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Quick Start", href: "#start" },
                { label: "Roadmap", href: "#roadmap" },
                {
                  label: "Odysseus Core",
                  href: "https://github.com/pewdiepie-archdaemon/odysseus",
                },
                { label: "GitHub", href: "https://github.com/synaphos" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    l.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="font-mono text-[10px] leading-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="p-6 border-b-2 md:border-b-0 border-r-2 border-foreground">
            <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-4">
              COMMUNITY
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "GitHub Discussions",
                  href: "https://github.com/synaphos",
                },
                { label: "X / Twitter", href: "https://x.com/Synaphos" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] leading-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-4">
              ROADMAP STATUS
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Local AI workspace", done: true },
                { label: "Multi-model support", done: true },
                { label: "Docker one-command setup", done: true },
                { label: "SIWE wallet auth", done: false },
                { label: "Base attestation", done: false },
                { label: "IPFS storage", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 flex-shrink-0 ${
                      item.done
                        ? "bg-foreground"
                        : "border border-foreground/30"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] ${
                      item.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            © 2026 SYNAPHOS · MIT LICENSE · SYNAPHOS.COM
          </span>
        </div>
      </footer>
    </div>
  );
}
