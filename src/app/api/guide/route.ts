import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/api-guard";
import kbData from "./kb-index-q.json";

/**
 * POST /api/guide  — backend brain for the Erken GoHighLevel guide extension.
 *
 * The extension sends { question, elements, stepsDone } (element LABELS only —
 * never page content). This route:
 *   1. embeds the question (OpenAI text-embedding-3-small),
 *   2. retrieves the top GoHighLevel help-center chunks from the bundled index,
 *   3. asks Claude (Haiku) which on-screen element to click next + what to say,
 *   4. returns { index, say, done }.
 *
 * Keys (ANTHROPIC_API_KEY, OPENAI_API_KEY) live in Vercel env — never in the
 * extension. CORS is open (the caller is a chrome-extension:// origin) but
 * rate-limited per IP.
 */

const MODEL = "claude-haiku-4-5";
const EMBED_MODEL = "text-embedding-3-small";
const TOP_K = 5;

// ── decode the quantized KB once per warm instance ─────────────────────────
type Kb = { dim: number; n: number; scales: number[]; vecs: Int8Array;
            meta: { slug: string; title: string; url: string; text: string }[] };
let KB: Kb | null = null;
function kb(): Kb {
  if (KB) return KB;
  const d = kbData as unknown as { dim: number; n: number; scales: number[]; vectors: string; meta: Kb["meta"] };
  const bin = Buffer.from(d.vectors, "base64");
  const vecs = new Int8Array(bin.length);
  for (let i = 0; i < bin.length; i++) vecs[i] = (bin[i] << 24) >> 24;
  KB = { dim: d.dim, n: d.n, scales: d.scales, vecs, meta: d.meta };
  return KB;
}

async function embed(question: string): Promise<number[] | null> {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: question }),
  });
  if (!r.ok) return null;
  const d = await r.json();
  return d.data[0].embedding;
}

function topChunks(q: number[] | null, k: number) {
  const K = kb();
  if (!q || !K.n) return [];
  let qn = 0;
  for (const x of q) qn += x * x;
  qn = Math.sqrt(qn) || 1;
  const scored: { s: number; i: number }[] = [];
  for (let i = 0; i < K.n; i++) {
    let dot = 0, vn = 0;
    const off = i * K.dim, s = K.scales[i] / 127;
    for (let j = 0; j < K.dim; j++) {
      const v = K.vecs[off + j] * s;
      dot += v * q[j]; vn += v * v;
    }
    scored.push({ s: dot / ((Math.sqrt(vn) || 1) * qn), i });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, k).map((x) => K.meta[x.i]);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  if (!rateLimit(`guide:${clientIp(req)}`, 40, 60 * 60_000)) {
    return NextResponse.json({ error: "rate limit — try again shortly" }, { status: 429, headers: CORS });
  }
  const akey = (process.env.ANTHROPIC_API_KEY || "").trim();
  if (!akey) return NextResponse.json({ error: "server not configured" }, { status: 500, headers: CORS });

  let body: { question?: string; elements?: { i: number; text: string }[]; stepsDone?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400, headers: CORS }); }
  const question = String(body.question || "");
  const elements = Array.isArray(body.elements) ? body.elements : [];
  const done = Array.isArray(body.stepsDone) ? body.stepsDone : [];
  if (!question || !elements.length) return NextResponse.json({ error: "missing question/elements" }, { status: 400, headers: CORS });

  // RAG (best-effort)
  let kbContext = "";
  try {
    const hits = topChunks(await embed(question), TOP_K);
    if (hits.length) {
      kbContext = "\n\nOfficial GoHighLevel help-center excerpts that may be relevant:\n" +
        hits.map((h, i) => `--- [${i + 1}] ${h.title} ---\n${h.text}`).join("\n") + "\n--- end of excerpts ---";
    }
  } catch { /* no RAG this round */ }

  const list = elements.map((e) => `${e.i}: ${e.text}`).join("\n");
  const progress = done.length
    ? `\n\nSteps you have ALREADY guided (most recent last), now DONE:\n${done.map((s, i) => `${i + 1}. ${s}`).join("\n")}\nThe user just completed the last one; the screen below is the NEW state.`
    : "";
  const sys =
    "You are Erken, a friendly guide walking a user THROUGH a whole task in the " +
    "Erken Systems business platform, ONE step at a time. WHITE-LABEL RULE: the " +
    "platform is a white-labeled product — the user knows it ONLY as 'Erken Systems'. " +
    "NEVER say 'GoHighLevel', 'HighLevel', or 'GHL' in your spoken guidance, even " +
    "though the help excerpts use those names — translate them to 'Erken Systems' " +
    "or just 'the platform'. You get: (a) official help excerpts (may be " +
    "empty), (b) steps already guided, (c) the numbered clickable elements on the " +
    "CURRENT screen (index: label), (d) the user's overall goal. Use the excerpts " +
    "to know the real procedure, then pick the SINGLE element to click for the NEXT " +
    "step — do NOT re-point at a done step; ADVANCE (a tab, then a Create/Add/New " +
    "button, then a field). " +
    'Reply ONLY with strict JSON, no prose/fences: {"index": <number>, "say": ' +
    '"<spoken guidance>", "done": <true|false>}. For the FINAL save step, name the ' +
    "exact button and say it's the last step. Set done:true when the goal is " +
    "achieved (then index -1, say = short warm closing that says where to find it). " +
    "say is READ ALOUD: natural, 1-2 short sentences, name buttons by LABEL, NEVER " +
    'mention index numbers, the word "element", the excerpts, or that you got a list. ' +
    'If the next element isn\'t on screen, index -1, done false, say what to open first.';

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": akey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL, max_tokens: 350, system: sys,
      messages: [{ role: "user", content: `Overall goal: ${question}${progress}\n\nClickable elements on the current screen:\n${list}${kbContext}` }],
    }),
  });
  if (!r.ok) return NextResponse.json({ error: "ai " + r.status }, { status: 502, headers: CORS });
  const data = await r.json();
  const text = (data.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("").trim();
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return NextResponse.json({ error: "no json", raw: text }, { status: 502, headers: CORS });
  let parsed;
  try { parsed = JSON.parse(m[0]); } catch { return NextResponse.json({ error: "bad json" }, { status: 502, headers: CORS }); }
  return NextResponse.json({ index: parsed.index, say: parsed.say, done: !!parsed.done }, { headers: CORS });
}
