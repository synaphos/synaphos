const BASE_URL = () =>
  localStorage.getItem("odysseus_url") || "http://localhost:8000";

export interface OdysseusStatus {
  ok: boolean;
  version?: string;
  error?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SessionRecord {
  id: string;
  model: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
}

export async function checkOdysseus(): Promise<OdysseusStatus> {
  try {
    const res = await fetch(`${BASE_URL()}/healthz`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json().catch(() => ({}));
    return { ok: true, version: data.version };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Connection failed";
    return { ok: false, error: msg };
  }
}

export async function getModels(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL()}/v1/models`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data))
      return data.map((m: { id?: string; name?: string }) => m.id || m.name || String(m));
    if (data.data && Array.isArray(data.data))
      return data.data.map((m: { id?: string }) => m.id || String(m));
    return [];
  } catch {
    return [];
  }
}

export async function* streamChat(
  messages: ChatMessage[],
  model: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL()}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(err);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        continue;
      }
    }
  }
}

export function getOdysseusUrl(): string {
  return BASE_URL();
}

export function setOdysseusUrl(url: string): void {
  localStorage.setItem("odysseus_url", url);
}

export function getSessions(): SessionRecord[] {
  try {
    return JSON.parse(localStorage.getItem("synaphos_sessions") || "[]");
  } catch {
    return [];
  }
}

export function saveSession(session: SessionRecord): void {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  localStorage.setItem("synaphos_sessions", JSON.stringify(sessions.slice(0, 100)));
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem("synaphos_sessions", JSON.stringify(sessions));
}
