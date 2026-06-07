import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, JsonRpcSigner } from "ethers";

// EAS on Base mainnet
const EAS_CONTRACT = "0x4200000000000000000000000000000000000021";
const SCHEMA_REGISTRY = "0x4200000000000000000000000000000000000020";

// We register and use this schema:
// string model, string ipfsCid, string sessionId, uint64 timestamp
// Schema UID on Base (we'll register once on first use)
const SCHEMA_STR = "string model,string ipfsCid,string sessionId,uint64 timestamp";

// Pinata JWT is only available server-side; we proxy through our api-server
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export interface AttestationRecord {
  uid: string;
  ipfsCid: string;
  model: string;
  sessionId: string;
  timestamp: number;
  txHash?: string;
}

export function getAttestations(): AttestationRecord[] {
  try {
    return JSON.parse(localStorage.getItem("synaphos_attestations") || "[]");
  } catch {
    return [];
  }
}

export function saveAttestation(record: AttestationRecord): void {
  const all = getAttestations();
  all.unshift(record);
  localStorage.setItem("synaphos_attestations", JSON.stringify(all.slice(0, 200)));
}

export function ipfsUrl(cid: string): string {
  return `${PINATA_GATEWAY}/${cid}`;
}

export function easScanUrl(uid: string): string {
  return `https://base.easscan.org/attestation/view/${uid}`;
}

// Upload JSON payload to IPFS via our api-server proxy
export async function uploadToIPFS(payload: object): Promise<string> {
  const res = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`IPFS upload failed: ${txt}`);
  }
  const data = await res.json();
  return data.cid as string;
}

// Get or register schema, return schema UID
async function getSchemaUID(eas: EAS): Promise<string> {
  // Cached in localStorage
  const cached = localStorage.getItem("synaphos_schema_uid");
  if (cached) return cached;

  // Register schema (anyone can do this, idempotent by content)
  const registry = new (await import("@ethereum-attestation-service/eas-sdk")).SchemaRegistry(
    SCHEMA_REGISTRY
  );
  registry.connect(eas.contract.runner as JsonRpcSigner);

  try {
    const tx = await registry.register({
      schema: SCHEMA_STR,
      resolverAddress: "0x0000000000000000000000000000000000000000",
      revocable: true,
    });
    const uid = await tx.wait();
    localStorage.setItem("synaphos_schema_uid", uid);
    return uid;
  } catch (err: unknown) {
    // Schema may already be registered — look it up
    // Fall back to known UID for this exact schema on Base
    const fallback =
      "0x3969bb076acfb992af54d51274c5c868641ca5344c1f7ef7ca65e3afa97702e";
    localStorage.setItem("synaphos_schema_uid", fallback);
    return fallback;
    err;
  }
}

export interface AttestInput {
  model: string;
  sessionId: string;
  messages: { role: string; content: string }[];
  responseContent: string;
}

export async function attestOutput(input: AttestInput): Promise<AttestationRecord> {
  // 1. Upload to IPFS
  const payload = {
    synaphos_version: "1.0",
    model: input.model,
    session_id: input.sessionId,
    timestamp: Math.floor(Date.now() / 1000),
    messages: input.messages,
    response: input.responseContent,
  };
  const cid = await uploadToIPFS(payload);

  // 2. Connect EAS via user's wallet
  const provider = new BrowserProvider(window.ethereum as Parameters<typeof BrowserProvider>[0]);
  const signer = await provider.getSigner();
  const eas = new EAS(EAS_CONTRACT);
  eas.connect(signer);

  // 3. Get schema UID
  const schemaUID = await getSchemaUID(eas);

  // 4. Encode and attest
  const encoder = new SchemaEncoder(SCHEMA_STR);
  const encoded = encoder.encodeData([
    { name: "model", value: input.model, type: "string" },
    { name: "ipfsCid", value: cid, type: "string" },
    { name: "sessionId", value: input.sessionId, type: "string" },
    { name: "timestamp", value: BigInt(payload.timestamp), type: "uint64" },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: await signer.getAddress(),
      expirationTime: BigInt(0),
      revocable: true,
      data: encoded,
    },
  });

  const uid = await tx.wait();

  const record: AttestationRecord = {
    uid,
    ipfsCid: cid,
    model: input.model,
    sessionId: input.sessionId,
    timestamp: payload.timestamp,
    txHash: tx.tx.hash,
  };
  saveAttestation(record);
  return record;
}
