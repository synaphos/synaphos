import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { checkOdysseus, getModels, getOdysseusUrl } from "@/lib/odysseus";

interface ServiceRow {
  name: string;
  status: "ok" | "error" | "checking";
  detail: string;
}

export default function MonitorPage() {
  const [services, setServices] = useState<ServiceRow[]>([
    { name: "ODYSSEUS CORE", status: "checking", detail: "Checking…" },
    { name: "MODEL ENDPOINT", status: "checking", detail: "Checking…" },
  ]);
  const [models, setModels] = useState<string[]>([]);
  const [lastChecked, setLastChecked] = useState<string>("");
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    const url = getOdysseusUrl();

    const health = await checkOdysseus();
    const modelList = await getModels();
    setModels(modelList);

    setServices([
      {
        name: "ODYSSEUS CORE",
        status: health.ok ? "ok" : "error",
        detail: health.ok
          ? `Connected · ${health.version ? `v${health.version}` : "healthy"} · ${url}`
          : `${health.error ?? "Unreachable"} · ${url}`,
      },
      {
        name: "MODEL ENDPOINT",
        status: modelList.length > 0 ? "ok" : "error",
        detail: modelList.length > 0
          ? `${modelList.length} model${modelList.length !== 1 ? "s" : ""} available`
          : health.ok
          ? "No models found — check Ollama is running"
          : "Unreachable",
      },
    ]);
    setLastChecked(new Date().toLocaleTimeString());
    setChecking(false);
  };

  useEffect(() => {
    check();
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, []);

  const statusColor = (s: ServiceRow["status"]) =>
    s === "ok" ? "#12A150" : s === "error" ? "#CC1100" : "#888";

  const statusLabel = (s: ServiceRow["status"]) =>
    s === "ok" ? "ONLINE" : s === "error" ? "OFFLINE" : "CHECKING";

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b-2 border-foreground px-6 py-3 flex items-center justify-between flex-shrink-0 bg-background sticky top-0 z-10">
        <span className="font-display text-2xl tracking-widest">SYSTEM MONITOR</span>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground hidden sm:block">
              LAST CHECK: {lastChecked}
            </span>
          )}
          <button
            onClick={check}
            disabled={checking}
            className="font-mono text-[9px] tracking-widest border-2 border-foreground px-3 py-1.5 flex items-center gap-1.5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${checking ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 max-w-3xl">
        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">SERVICES</div>
          <div className="border-2 border-foreground">
            {services.map((svc, i) => (
              <div
                key={svc.name}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < services.length - 1 ? "border-b-2 border-foreground" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusColor(svc.status) }}
                  />
                  <div>
                    <div className="font-display text-base tracking-wide">{svc.name}</div>
                    <div className="font-mono text-[9px] text-muted-foreground mt-0.5 break-all">{svc.detail}</div>
                  </div>
                </div>
                <span
                  className="font-mono text-[9px] tracking-widest border px-2 py-0.5 flex-shrink-0 ml-4"
                  style={{ borderColor: statusColor(svc.status), color: statusColor(svc.status) }}
                >
                  {statusLabel(svc.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">
            AVAILABLE MODELS ({models.length})
          </div>
          {models.length === 0 ? (
            <div className="border-2 border-foreground/30 px-4 py-6 text-center">
              <div className="font-mono text-[10px] text-muted-foreground">
                No models detected. Ensure Odysseus is running and Ollama has at least one model pulled.
              </div>
              <div className="font-mono text-[9px] text-primary mt-2">
                $ ollama pull llama3.2
              </div>
            </div>
          ) : (
            <div className="border-2 border-foreground">
              {models.map((m, i) => (
                <div
                  key={m}
                  className={`flex items-center gap-3 px-4 py-2.5 ${
                    i < models.length - 1 ? "border-b border-foreground/20" : ""
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-foreground flex-shrink-0" />
                  <span className="font-mono text-[11px] tracking-wide">{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-3">SETUP REFERENCE</div>
          <div className="border-2 border-foreground/30 p-4 flex flex-col gap-3">
            {[
              { label: "Start Odysseus", cmd: "docker compose up -d" },
              { label: "Pull a model", cmd: "ollama pull llama3.2" },
              { label: "Check Ollama models", cmd: "ollama list" },
              { label: "View logs", cmd: "docker compose logs -f odysseus" },
            ].map((item) => (
              <div key={item.label}>
                <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-0.5">{item.label}</div>
                <div className="font-mono text-[11px] bg-foreground text-background px-3 py-1.5">
                  <span className="text-primary mr-1">$</span>{item.cmd}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
