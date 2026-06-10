// Shared guards for the public API routes: origin allowlist + a small
// in-memory rate limiter.
//
// Serverless caveat: the limiter is per-instance (each lambda keeps its own
// map), so treat it as abuse DAMPING, not a hard quota — the hard money cap
// lives in the voice bridge's daily call counter. Origin checks stop
// cross-site browser abuse; scripted attackers can spoof Origin, which is
// what the rate limit is for.

const ALLOWED_HOSTS = new Set(["erken.systems", "www.erken.systems", "localhost:3000"]);

export function originAllowed(req: Request): boolean {
  const src = req.headers.get("origin") || req.headers.get("referer");
  if (!src) return false; // browsers always send Origin on fetch POSTs
  try {
    const host = new URL(src).host;
    return ALLOWED_HOSTS.has(host) || host.endsWith(".vercel.app"); // previews
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/** True while `key` is under `limit` hits per rolling `windowMs` window. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
    }
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count++;
  return b.count <= limit;
}
