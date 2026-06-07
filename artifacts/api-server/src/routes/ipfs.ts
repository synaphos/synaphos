import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/ipfs/upload", async (req, res) => {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    res.status(500).json({ error: "PINATA_JWT not configured" });
    return;
  }

  try {
    const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        pinataContent: req.body,
        pinataMetadata: { name: `synaphos-attestation-${Date.now()}` },
        pinataOptions: { cidVersion: 1 },
      }),
    });

    if (!pinataRes.ok) {
      const txt = await pinataRes.text();
      res.status(502).json({ error: `Pinata error: ${txt}` });
      return;
    }

    const data = (await pinataRes.json()) as { IpfsHash: string };
    res.json({ cid: data.IpfsHash });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
