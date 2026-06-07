import { useState, useEffect } from "react";
import { Check, ExternalLink, Terminal } from "lucide-react";
import { getOdysseusUrl, setOdysseusUrl, checkOdysseus } from "@/lib/odysseus";

const SETUP_STEPS = [
  {
    step: "01",
    title: "Prerequisites",
    items: [
      "Machine with 8 GB+ RAM (16 GB+ recommended)",
      "Docker Desktop installed and running",
      "Git installed",
    ],
  },
  {
    step: "02",
    title: "Clone and start Odysseus",
    cmd: "git clone https://github.com/pewdiepie-archdaemon/odysseus\ncd odysseus\ndocker compose up -d",
  },
  {
    step: "03",
    title: "Pull a model via Ollama",
    cmd: "ollama pull llama3.2",
    note: "Ollama starts inside the Docker container. Any model from ollama.com/library works.",
  },
  {
    step: "04",
    title: "Connect Synaphos",
    note: "Set the Backend URL below to where Odysseus is running, then click Save.",
  },
];

export default function SettingsPage({ onSave }: { onSave: () => void }) {
  const [url, setUrl] = useState(getOdysseusUrl);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    setUrl(getOdysseusUrl());
  }, []);

  const save = () => {
    const trimmed = url.trim().replace(/\/$/, "");
    setOdysseusUrl(trimmed);
    setUrl(trimmed);
    setSaved(true);
    onSave();
    setTimeout(() => setSaved(false), 2000);
  };

  const test = async () => {
    setTesting(true);
    setTestResult(null);
    const prev = getOdysseusUrl();
    setOdysseusUrl(url.trim().replace(/\/$/, ""));
    const result = await checkOdysseus();
    setOdysseusUrl(prev);
    setTestResult(
      result.ok
        ? { ok: true, msg: `Connected${result.version ? ` · v${result.version}` : ""}` }
        : { ok: false, msg: result.error ?? "Connection failed" }
    );
    setTesting(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b-2 border-foreground px-6 py-3 flex-shrink-0 bg-background sticky top-0 z-10">
        <span className="font-display text-2xl tracking-widest">SETTINGS</span>
      </div>

      <div className="p-6 flex flex-col gap-8 max-w-2xl">

        {/* What this is — honest context */}
        <div className="border-2 border-foreground/20 p-4 bg-foreground/[0.03]">
          <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-2">HOW THIS WORKS</div>
          <p className="font-mono text-[10px] leading-5 text-muted-foreground">
            Synaphos is a UI that connects to{" "}
            <a
              href="https://github.com/pewdiepie-archdaemon/odysseus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-primary transition-colors"
            >
              Odysseus
            </a>{" "}
            — a local AI backend you run on your own machine. All inference
            happens on your hardware via Ollama. No cloud. No API key. No data
            leaves your machine.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-primary flex-shrink-0" />
            <span className="font-mono text-[9px] text-primary tracking-widest">
              REQUIRES ODYSSEUS RUNNING LOCALLY — see setup below
            </span>
          </div>
        </div>

        {/* Connection config */}
        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">BACKEND URL</div>
          <div className="border-2 border-foreground p-4 flex flex-col gap-4">
            <div>
              <label className="font-mono text-[9px] tracking-widest block mb-2">
                ODYSSEUS URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full font-mono text-[12px] bg-background border-2 border-foreground/40 px-3 py-2 outline-none focus:border-foreground transition-colors"
              />
              <div className="font-mono text-[8px] tracking-widest text-muted-foreground mt-1.5">
                Default: http://localhost:8000 — change if Odysseus runs on a remote server
              </div>
            </div>

            {testResult && (
              <div
                className="font-mono text-[10px] px-3 py-2 border"
                style={{
                  borderColor: testResult.ok ? "#12A150" : "#CC1100",
                  color: testResult.ok ? "#12A150" : "#CC1100",
                  backgroundColor: testResult.ok ? "#12A15010" : "#CC110010",
                }}
              >
                {testResult.ok ? "CONNECTED — " : "FAILED — "}{testResult.msg}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={test}
                disabled={testing}
                className="font-mono text-[9px] tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
              >
                {testing ? "TESTING…" : "TEST CONNECTION"}
              </button>
              <button
                onClick={save}
                className="font-mono text-[9px] tracking-widest bg-foreground text-background px-4 py-2 hover:bg-primary transition-colors flex items-center gap-1.5"
              >
                {saved ? <><Check className="w-3 h-3" /> SAVED</> : "SAVE"}
              </button>
            </div>
          </div>
        </div>

        {/* Setup guide */}
        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3 flex items-center justify-between">
            <span>SETUP GUIDE</span>
            <a
              href="https://github.com/pewdiepie-archdaemon/odysseus"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[8px] tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              FULL DOCS <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="flex flex-col gap-4">
            {SETUP_STEPS.map((s) => (
              <div key={s.step} className="border-2 border-foreground/20 p-4">
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-mono text-[8px] tracking-widest text-primary flex-shrink-0 mt-0.5">{s.step}</span>
                  <span className="font-display text-base tracking-wide">{s.title}</span>
                </div>
                {s.items && (
                  <ul className="ml-6 flex flex-col gap-1 mb-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="w-1 h-1 border border-foreground/40 flex-shrink-0" />
                        <span className="font-mono text-[9px] text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.cmd && (
                  <div className="ml-6 bg-foreground text-background px-3 py-2 mt-2">
                    <div className="flex items-center gap-2 mb-1.5 opacity-40">
                      <Terminal className="w-3 h-3" />
                      <span className="font-mono text-[7px] tracking-widest">TERMINAL</span>
                    </div>
                    {s.cmd.split("\n").map((line, i) => (
                      <div key={i} className="font-mono text-[10px] leading-5">
                        <span className="text-primary mr-1">$</span>{line}
                      </div>
                    ))}
                  </div>
                )}
                {s.note && (
                  <p className="ml-6 mt-2 font-mono text-[9px] text-muted-foreground leading-4">{s.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">ABOUT</div>
          <div className="border-2 border-foreground/20 p-4 flex flex-col gap-2">
            {[
              { label: "APP", val: "Synaphos" },
              { label: "BACKEND", val: "Odysseus (FastAPI + Ollama)" },
              { label: "INFERENCE", val: "100% local — your hardware" },
              { label: "LICENSE", val: "MIT" },
              { label: "ODYSSEUS", val: "github.com/pewdiepie-archdaemon/odysseus" },
            ].map((row) => (
              <div key={row.label} className="flex gap-4 border-b border-foreground/10 pb-1.5">
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground w-24 flex-shrink-0">{row.label}</span>
                <span className="font-mono text-[10px]">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data */}
        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">DATA</div>
          <div className="border-2 border-foreground/20 p-4 flex flex-col gap-3">
            <p className="font-mono text-[10px] leading-5 text-muted-foreground">
              Chat sessions are stored in your browser only. Nothing is sent to any server except your local Odysseus instance.
            </p>
            <button
              onClick={() => {
                if (confirm("Delete all chat sessions? This cannot be undone.")) {
                  localStorage.removeItem("synaphos_sessions");
                  window.location.reload();
                }
              }}
              className="font-mono text-[9px] tracking-widest border-2 border-destructive text-destructive px-4 py-2 hover:bg-destructive hover:text-background transition-colors w-fit"
            >
              CLEAR ALL SESSIONS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
