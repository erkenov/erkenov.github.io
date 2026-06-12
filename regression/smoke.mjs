// Website regression smoke — pages render + API-guard contract (403/200/400/401/429).
//
// Zero new dependencies (plain Node fetch). Zero AI cost by design: every check
// hits a path that returns BEFORE any paid API call (bad origin, wrong secret,
// empty body, <200-char summarize text).
//
// Usage:
//   node regression/smoke.mjs                       -> http://localhost:3000 (auto-starts `npm run start` if down; requires a prior `next build`)
//   node regression/smoke.mjs https://erken.systems -> against production
//
// Normally invoked via regression\run-regression.cmd (which builds first).

import { spawn } from "node:child_process";

const BASE = (process.argv[2] || process.env.SMOKE_BASE || "http://localhost:3000").replace(/\/$/, "");
const IS_LOCAL = /localhost|127\.0\.0\.1/.test(BASE);
// originAllowed() accepts localhost:3000 and erken.systems — pick whichever fits.
const GOOD_ORIGIN = IS_LOCAL ? BASE : "https://erken.systems";

let pass = 0, fail = 0, warn = 0;
const ok = (name) => { pass++; console.log(`  PASS  ${name}`); };
const bad = (name, detail) => { fail++; console.log(`  FAIL  ${name}  ${detail || ""}`); };
const wrn = (name, detail) => { warn++; console.log(`  WARN  ${name}  ${detail || ""}`); };

async function up() {
  try { const r = await fetch(BASE, { signal: AbortSignal.timeout(4000) }); return r.status < 500; }
  catch { return false; }
}

let server = null;
async function ensureServer() {
  if (await up()) return;
  if (!IS_LOCAL) { console.error(`${BASE} is not reachable.`); process.exit(1); }
  console.log("  starting `npm run start` (needs a prior `next build`)...");
  server = spawn("npm", ["run", "start"], { shell: true, stdio: "ignore", detached: false });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await up()) return;
  }
  console.error("server did not come up in 30s — run `npm run build` first?");
  killServer(); process.exit(1);
}
function killServer() {
  if (server && server.pid) {
    try { spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { shell: true }); } catch {}
  }
}

async function get(path) { return fetch(BASE + path, { signal: AbortSignal.timeout(15000) }); }
async function post(path, body, headers = {}) {
  return fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
}

async function main() {
  console.log(`Smoke against ${BASE}\n`);
  await ensureServer();

  // ── pages render ──────────────────────────────────────────────────────────
  for (const p of ["/", "/privacy", "/balance", "/claude"]) {
    try {
      const r = await get(p);
      const html = await r.text();
      if (r.status === 200 && /erken/i.test(html)) ok(`GET ${p} -> 200, looks like our HTML`);
      else bad(`GET ${p}`, `status=${r.status}`);
    } catch (e) { bad(`GET ${p}`, String(e)); }
  }

  // ── /api/retell-web-call: origin gate (every token = a paid call — never mint one here)
  let r = await post("/api/retell-web-call", {});
  r.status === 403 ? ok("retell-web-call: no Origin -> 403") : bad("retell-web-call: no Origin", `got ${r.status}, want 403`);
  r = await post("/api/retell-web-call", {}, { Origin: "https://evil.example.com" });
  r.status === 403 ? ok("retell-web-call: bad Origin -> 403") : bad("retell-web-call: bad Origin", `got ${r.status}, want 403`);

  // ── /api/assistant-token: origin ok + wrong secret -> 401 (timing-safe path exercised, no token minted)
  r = await post("/api/assistant-token", { secret: "definitely-wrong-" + Date.now() }, { Origin: GOOD_ORIGIN });
  if (r.status === 401) ok("assistant-token: wrong secret -> 401");
  else if (r.status === 429) wrn("assistant-token", "429 — rate limiter already hot (previous runs); auth path not re-verified");
  else if (r.status === 500 && IS_LOCAL) wrn("assistant-token", "500 — secret/key env not set locally (expected in dev)");
  else bad("assistant-token: wrong secret", `got ${r.status}, want 401`);

  // ── /api/feedback: empty message -> 400 (never reaches Telegram)
  r = await post("/api/feedback", { kind: "bug", message: "" });
  if (r.status === 400) ok("feedback: empty message -> 400");
  else if (r.status === 429) wrn("feedback", "429 — limiter hot from previous runs");
  else if (r.status === 500 && IS_LOCAL) wrn("feedback", "500 — Telegram env not set locally (expected in dev)");
  else bad("feedback: empty message", `got ${r.status}, want 400`);

  // ── /api/summarize: <200 chars returns the friendly no-op BEFORE any Anthropic call
  r = await post("/api/summarize", { text: "too short to summarize", title: "t", url: "u" });
  if (r.status === 200) {
    const d = await r.json().catch(() => ({}));
    /isn't much/i.test(d.say || "") ? ok("summarize: short text -> friendly no-op (no AI call)") : wrn("summarize", `200 but unexpected say: ${JSON.stringify(d).slice(0, 80)}`);
  } else if (r.status === 429) wrn("summarize", "429 — hourly quota already used on this IP");
  else if (r.status === 500 && IS_LOCAL) wrn("summarize", "500 — ANTHROPIC_API_KEY not set locally? (key check precedes body parse)");
  else bad("summarize: short text", `got ${r.status}`);

  // ── rate limiter actually fires (the 429 path). Deterministic on localhost
  // (one process). On Vercel the limiter is per-lambda, so prod may never 429
  // here — WARN, not FAIL. Short text keeps every hit at zero AI cost.
  let got429 = false;
  for (let i = 0; i < 7 && !got429; i++) {
    const rr = await post("/api/summarize", { text: "x" });
    if (rr.status === 429) got429 = true;
  }
  if (got429) ok("summarize: limiter fires -> 429 within 7 hits");
  else if (IS_LOCAL) bad("summarize: limiter never fired", "7 hits, no 429 — rateLimit() broken?");
  else wrn("summarize limiter", "no 429 on prod (per-instance limiter — requests spread across lambdas); not a failure");

  // ── /api/balance returns JSON, never a 5xx (its contract is 'never throw')
  try {
    r = await get("/api/balance?locationId=smoke-test-not-allowed");
    const isJson = (r.headers.get("content-type") || "").includes("json");
    r.status < 500 && isJson ? ok(`balance: unknown location -> ${r.status} JSON (fail-closed, no 5xx)`) : bad("balance", `status=${r.status} json=${isJson}`);
  } catch (e) { bad("balance", String(e)); }

  console.log(`\nRESULT: ${pass} pass, ${warn} warn, ${fail} fail`);
  killServer();
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error(e); killServer(); process.exit(1); });
