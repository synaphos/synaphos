import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Square, Plus, Trash2, ChevronDown, ShieldCheck, Loader2, ExternalLink } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKit } from "@reown/appkit/react";
import {
  streamChat,
  getModels,
  getSessions,
  saveSession,
  deleteSession,
  type ChatMessage,
  type SessionRecord,
} from "@/lib/odysseus";
import { attestOutput, easScanUrl, type AttestationRecord } from "@/lib/onchain";

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function deriveTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  return first.content.slice(0, 48) + (first.content.length > 48 ? "…" : "");
}

type AttestState = "idle" | "uploading" | "signing" | "done" | "error";

function AttestButton({
  messages,
  responseContent,
  model,
  sessionId,
}: {
  messages: ChatMessage[];
  responseContent: string;
  model: string;
  sessionId: string;
}) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const [state, setState] = useState<AttestState>("idle");
  const [record, setRecord] = useState<AttestationRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttest = async () => {
    if (!isConnected) {
      open();
      return;
    }
    setState("uploading");
    setError(null);
    try {
      setState("signing");
      const rec = await attestOutput({ model, sessionId, messages, responseContent });
      setRecord(rec);
      setState("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Attestation failed");
      setState("error");
    }
  };

  if (state === "done" && record) {
    return (
      <a
        href={easScanUrl(record.uid)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-mono text-[8px] tracking-widest text-primary hover:underline mt-1.5"
      >
        <ShieldCheck className="w-3 h-3 flex-shrink-0" />
        ATTESTED ON BASE
        <ExternalLink className="w-2.5 h-2.5" />
      </a>
    );
  }

  if (state === "error") {
    return (
      <div className="mt-1.5 flex flex-col gap-0.5">
        <span className="font-mono text-[8px] tracking-widest text-destructive">
          {error ?? "Failed"}
        </span>
        <button
          onClick={() => { setState("idle"); setError(null); }}
          className="font-mono text-[8px] tracking-widest text-muted-foreground hover:text-foreground"
        >
          RETRY
        </button>
      </div>
    );
  }

  const busy = state === "uploading" || state === "signing";

  return (
    <button
      onClick={handleAttest}
      disabled={busy}
      className="mt-1.5 flex items-center gap-1 font-mono text-[8px] tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
    >
      {busy ? (
        <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
      ) : (
        <ShieldCheck className="w-3 h-3 flex-shrink-0" />
      )}
      {state === "uploading"
        ? "UPLOADING TO IPFS…"
        : state === "signing"
        ? "SIGN IN WALLET…"
        : isConnected
        ? "ATTEST ON BASE"
        : "CONNECT WALLET TO ATTEST"}
    </button>
  );
}

function MessageBubble({
  msg,
  prevMessages,
  model,
  sessionId,
  canAttest,
}: {
  msg: ChatMessage;
  prevMessages: ChatMessage[];
  model: string;
  sessionId: string | null;
  canAttest: boolean;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`font-mono text-[10px] tracking-widest mb-1 ${
            isUser ? "text-right text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          {isUser ? "YOU" : "ODYSSEUS"}
        </div>
        <div
          className={`px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap border-2 ${
            isUser
              ? "bg-foreground text-background border-foreground"
              : "bg-card border-foreground/20"
          }`}
        >
          {msg.content}
        </div>
        {!isUser && canAttest && sessionId && (
          <AttestButton
            messages={prevMessages}
            responseContent={msg.content}
            model={model}
            sessionId={sessionId}
          />
        )}
      </div>
    </div>
  );
}

export default function ChatPage({
  backendOk,
  defaultModel,
}: {
  backendOk: boolean;
  defaultModel: string;
}) {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => getSessions());
  const [activeId, setActiveId] = useState<string | null>(
    () => getSessions()[0]?.id ?? null
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const s = getSessions()[0];
    return s?.messages ?? [];
  });
  const [model, setModel] = useState(defaultModel);
  const [models, setModels] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getModels().then((m) => {
      if (m.length > 0) {
        setModels(m);
        if (!model && m[0]) setModel(m[0]);
      }
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const loadSession = (id: string) => {
    const s = getSessions().find((x) => x.id === id);
    if (!s) return;
    setActiveId(id);
    setMessages(s.messages);
    setModel(s.model);
  };

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
    setStreamingText("");
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    const updated = getSessions();
    setSessions(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id ?? null);
      setMessages(updated[0]?.messages ?? []);
    }
  };

  const send = useCallback(async () => {
    if (!input.trim() || streaming) return;
    if (!backendOk) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setStreamingText("");

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let full = "";
    try {
      for await (const chunk of streamChat(nextMessages, model, ctrl.signal)) {
        full += chunk;
        setStreamingText(full);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        full = `[Error: ${(e as Error).message}]`;
        setStreamingText(full);
      }
    }

    const assistantMsg: ChatMessage = { role: "assistant", content: full };
    const finalMessages = [...nextMessages, assistantMsg];
    setMessages(finalMessages);
    setStreamingText("");
    setStreaming(false);

    const sessionId = activeId ?? randomId();
    const session: SessionRecord = {
      id: sessionId,
      model,
      title: deriveTitle(finalMessages),
      messages: finalMessages,
      created_at: new Date().toISOString(),
    };
    saveSession(session);
    setActiveId(sessionId);
    setSessions(getSessions());
  }, [input, streaming, messages, model, activeId, backendOk]);

  const stop = () => {
    abortRef.current?.abort();
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 border-r-2 border-foreground bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200 ${
          sidebarOpen ? "w-56" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        <div className="border-b border-sidebar-border px-3 py-2 flex items-center justify-between flex-shrink-0">
          <span className="font-mono text-[9px] tracking-widest opacity-60">SESSIONS</span>
          <button
            onClick={newChat}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="New chat"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 && (
            <div className="px-3 py-4 font-mono text-[9px] opacity-40 tracking-widest">
              NO SESSIONS
            </div>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`w-full text-left px-3 py-2.5 border-b border-sidebar-border/40 flex items-start justify-between gap-1 hover:bg-white/5 transition-colors group ${
                activeId === s.id ? "bg-white/10" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="font-mono text-[9px] opacity-40 tracking-widest mb-0.5">
                  {new Date(s.created_at).toLocaleDateString()}
                </div>
                <div className="font-sans text-[11px] truncate leading-snug">
                  {s.title}
                </div>
              </div>
              <button
                onClick={(e) => deleteChat(s.id, e)}
                className="flex-shrink-0 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-0.5 mt-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="border-b-2 border-foreground px-4 py-2 flex items-center justify-between flex-shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="font-mono text-[9px] tracking-widest border border-foreground/30 px-2 py-1 hover:bg-foreground hover:text-background transition-colors"
            >
              {sidebarOpen ? "HIDE" : "SESSIONS"}
            </button>
            <button
              onClick={newChat}
              className="font-mono text-[9px] tracking-widest border border-foreground/30 px-2 py-1 hover:bg-foreground hover:text-background transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> NEW
            </button>
          </div>
          <div className="flex items-center gap-2">
            {models.length > 0 ? (
              <div className="relative flex items-center">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="font-mono text-[9px] tracking-widest bg-background border border-foreground/30 px-2 py-1 pr-6 appearance-none cursor-pointer hover:border-foreground transition-colors outline-none"
                >
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none opacity-60" />
              </div>
            ) : (
              <span className="font-mono text-[9px] tracking-widest text-muted-foreground border border-foreground/20 px-2 py-1">
                {model || "NO MODEL"}
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
              <div className="font-display text-4xl tracking-widest">ODYSSEUS</div>
              <div className="font-mono text-[10px] tracking-widest">
                {backendOk ? "READY · TYPE A MESSAGE BELOW" : "BACKEND OFFLINE · CHECK SETTINGS"}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              prevMessages={messages.slice(0, i + 1)}
              model={model}
              sessionId={activeId}
              canAttest={!streaming && msg.role === "assistant"}
            />
          ))}
          {streaming && streamingText && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%]">
                <div className="font-mono text-[10px] tracking-widest mb-1 text-muted-foreground">
                  ODYSSEUS
                </div>
                <div className="px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap border-2 bg-card border-foreground/20">
                  {streamingText}
                  <span className="blink">▌</span>
                </div>
              </div>
            </div>
          )}
          {streaming && !streamingText && (
            <div className="flex justify-start mb-4">
              <div className="px-4 py-3 border-2 bg-card border-foreground/20 font-mono text-[11px] flex items-center gap-2 text-muted-foreground">
                <span className="blink">▌</span> THINKING
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-foreground flex-shrink-0 bg-background">
          {!backendOk && (
            <div className="px-4 py-2 bg-primary/10 border-b border-foreground/20">
              <span className="font-mono text-[9px] tracking-widest text-primary">
                ODYSSEUS OFFLINE — Configure backend URL in Settings
              </span>
            </div>
          )}
          <div className="flex items-end gap-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={backendOk ? "Message Odysseus… (Enter to send, Shift+Enter for newline)" : "Odysseus offline — check Settings"}
              disabled={!backendOk || streaming}
              rows={1}
              style={{ resize: "none", minHeight: "48px", maxHeight: "160px" }}
              className="flex-1 font-mono text-[12px] bg-background px-4 py-3 outline-none disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-muted-foreground"
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
            />
            <button
              onClick={streaming ? stop : send}
              disabled={!backendOk && !streaming}
              className="h-12 w-12 flex items-center justify-center bg-foreground text-background hover:bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {streaming ? <Square className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div className="px-4 pb-1.5">
            <span className="font-mono text-[8px] tracking-widest text-muted-foreground">
              ENTER TO SEND · SHIFT+ENTER FOR NEWLINE · ATTEST RESPONSES ON BASE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
