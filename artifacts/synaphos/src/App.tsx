import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { MessageSquare, Activity, Settings, Wallet, ArrowLeft, ShieldCheck } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ChatPage from "@/pages/chat";
import MonitorPage from "@/pages/monitor";
import SettingsPage from "@/pages/settings";
import AttestationsPage from "@/pages/attestations";
import { checkOdysseus, getModels } from "@/lib/odysseus";
import { wagmiAdapter } from "@/lib/wallet";
import "@/lib/wallet";
import logoPath from "@assets/c22b81f9-1cbb-424a-a4a2-351d436277e6_1780786137788.png";

const queryClient = new QueryClient();

const DASH_NAV = [
  { path: "/dashboard", label: "CHAT", icon: MessageSquare },
  { path: "/dashboard/monitor", label: "MONITOR", icon: Activity },
  { path: "/dashboard/attestations", label: "ATTEST", icon: ShieldCheck },
  { path: "/dashboard/settings", label: "SETTINGS", icon: Settings },
];

function WalletConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";
  return (
    <button
      onClick={() => open()}
      className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] tracking-widest border transition-colors ${
        isConnected
          ? "border-primary text-primary hover:bg-primary hover:text-background"
          : "border-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      <Wallet className="w-3 h-3 flex-shrink-0" />
      {isConnected ? short : "CONNECT WALLET"}
    </button>
  );
}

function DashboardShell() {
  const [location] = useLocation();
  const [backendOk, setBackendOk] = useState(false);
  const [defaultModel, setDefaultModel] = useState("llama3.2");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" })
  );

  useEffect(() => {
    const check = async () => {
      const status = await checkOdysseus();
      setBackendOk(status.ok);
      if (status.ok) {
        const models = await getModels();
        if (models[0]) setDefaultModel(models[0]);
      }
    };
    check();
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" })),
      1000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b-2 border-foreground flex items-center h-10 px-4 gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logoPath} alt="Synaphos" className="w-6 h-6 object-contain flex-shrink-0" />
          <div className="font-display text-lg tracking-widest leading-none">SYNAPHOS</div>
          <div className="hidden sm:block font-mono text-[8px] tracking-widest text-muted-foreground border border-foreground/20 px-1.5 py-0.5">
            DASHBOARD
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-0 border-l border-foreground/20 pl-4 ml-2">
          {DASH_NAV.map((item) => {
            const Icon = item.icon;
            const active = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] tracking-widest transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <WalletConnectButton />

          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: backendOk ? "#12A150" : "#CC1100" }}
            />
            <span className="font-mono text-[8px] tracking-widest hidden sm:inline">
              {backendOk ? "ODYSSEUS ONLINE" : "OFFLINE"}
            </span>
          </div>

          <span className="font-mono text-[8px] tracking-widest text-muted-foreground hidden md:inline">
            {time} UTC
          </span>

          <Link
            href="/"
            className="font-mono text-[8px] tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="hidden lg:inline">HOME</span>
          </Link>
        </div>
      </div>

      {/* Page */}
      <div className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/dashboard">
            <ChatPage backendOk={backendOk} defaultModel={defaultModel} />
          </Route>
          <Route path="/dashboard/monitor">
            <MonitorPage />
          </Route>
          <Route path="/dashboard/attestations">
            <AttestationsPage />
          </Route>
          <Route path="/dashboard/settings">
            <SettingsPage onSave={() => checkOdysseus().then((s) => setBackendOk(s.ok))} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={DashboardShell} />
      <Route path="/dashboard/:rest*" component={DashboardShell} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
