import { useState, useEffect } from "react";
import { ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { getAttestations, easScanUrl, ipfsUrl, type AttestationRecord } from "@/lib/onchain";

export default function AttestationsPage() {
  const [records, setRecords] = useState<AttestationRecord[]>([]);

  const load = () => setRecords(getAttestations());

  useEffect(() => {
    load();
  }, []);

  const clear = () => {
    if (confirm("Delete all attestation history? (On-chain records remain.)")) {
      localStorage.removeItem("synaphos_attestations");
      setRecords([]);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b-2 border-foreground px-6 py-3 flex items-center justify-between flex-shrink-0 bg-background sticky top-0 z-10">
        <div>
          <span className="font-display text-2xl tracking-widest">ATTESTATIONS</span>
          <div className="font-mono text-[8px] tracking-widest text-muted-foreground mt-0.5">
            IPFS + BASE L2 · PERMANENT ON-CHAIN PROOF
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="font-mono text-[9px] tracking-widest border-2 border-foreground px-3 py-1.5 flex items-center gap-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> REFRESH
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 max-w-4xl">

        {/* What is this */}
        <div className="border-2 border-foreground/20 p-4 bg-foreground/[0.03]">
          <div className="font-mono text-[8px] tracking-widest text-muted-foreground mb-2">HOW IT WORKS</div>
          <p className="font-mono text-[10px] leading-5 text-muted-foreground">
            When you attest a chat response, the full conversation is uploaded to IPFS and a
            cryptographic proof is written to Base L2 via EAS. The on-chain record links your
            wallet, the model used, and the IPFS content — permanently and tamper-proof.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="border-2 border-foreground/20 px-6 py-12 flex flex-col items-center gap-3">
            <div className="font-display text-3xl tracking-widest opacity-20">NO ATTESTATIONS</div>
            <div className="font-mono text-[10px] text-muted-foreground text-center">
              Go to Chat → finish a conversation → click ATTEST on any response
            </div>
          </div>
        ) : (
          <>
            <div className="font-mono text-[8px] tracking-widest text-muted-foreground">
              {records.length} ATTESTATION{records.length !== 1 ? "S" : ""} · LOCAL CACHE
            </div>
            <div className="border-2 border-foreground">
              {records.map((r, i) => (
                <div
                  key={r.uid}
                  className={`p-4 flex flex-col gap-3 ${i < records.length - 1 ? "border-b-2 border-foreground" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[8px] tracking-widest text-muted-foreground">MODEL</span>
                        <span className="font-mono text-[10px]">{r.model}</span>
                        <span className="font-mono text-[8px] tracking-widest text-muted-foreground ml-2">TIME</span>
                        <span className="font-mono text-[10px]">
                          {new Date(r.timestamp * 1000).toUTCString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* IPFS */}
                    <div className="border border-foreground/20 p-2">
                      <div className="font-mono text-[7px] tracking-widest text-muted-foreground mb-1">IPFS CID</div>
                      <div className="font-mono text-[9px] truncate text-foreground/70 mb-1.5">{r.ipfsCid}</div>
                      <a
                        href={ipfsUrl(r.ipfsCid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[8px] tracking-widest text-primary flex items-center gap-1 hover:underline"
                      >
                        VIEW ON IPFS <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    {/* EAS */}
                    <div className="border border-foreground/20 p-2">
                      <div className="font-mono text-[7px] tracking-widest text-muted-foreground mb-1">ATTESTATION UID</div>
                      <div className="font-mono text-[9px] truncate text-foreground/70 mb-1.5">{r.uid}</div>
                      <a
                        href={easScanUrl(r.uid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[8px] tracking-widest text-primary flex items-center gap-1 hover:underline"
                      >
                        VIEW ON EASSCAN <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {r.txHash && (
                    <div>
                      <span className="font-mono text-[7px] tracking-widest text-muted-foreground">TX HASH · </span>
                      <a
                        href={`https://basescan.org/tx/${r.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[8px] text-primary hover:underline"
                      >
                        {r.txHash.slice(0, 20)}…
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={clear}
              className="font-mono text-[9px] tracking-widest border-2 border-destructive text-destructive px-4 py-2 hover:bg-destructive hover:text-background transition-colors w-fit flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" /> CLEAR LOCAL CACHE
            </button>
            <p className="font-mono text-[8px] text-muted-foreground">
              Clearing only removes local cache. On-chain attestations on Base are permanent.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
