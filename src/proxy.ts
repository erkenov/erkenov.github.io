import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Host-based demo routing (Shamil 2026-07-29, prep for fly.erken.systems).
 *
 * A future custom domain (e.g. fly.erken.systems) should serve the matching
 * /demo/[industry] page at its own root "/" instead of visitors having to
 * know the /demo/flight-schools path. DNS + the Vercel domain attachment
 * are NOT done here — that switch is Shamil's call — this only makes the
 * app-side routing ready for when it is.
 *
 * matcher: "/" scopes this to the exact root path, so it's a true no-op
 * (never even invoked) for every other path on every host, including the
 * main erken.systems domain and every /demo/* URL hit directly.
 *
 * Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts`
 * (function renamed `middleware` -> `proxy`); see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
 */

const DEMO_HOST_ROOTS: Record<string, string> = {
  // 2026-07-30: fly.erken.systems root now serves the homepage-clone rebuild
  // (/fly-erken, owner-approved). The older premium page stays reachable
  // directly at /demo/flight-schools.
  "fly.erken.systems": "/fly-erken",

  // 2026-08-03: 17 additional passion-industry demo subdomains, each
  // rewritten straight to its /demo/[industry] config-driven page (see
  // src/app/demo/config.ts + src/app/demo/configs/*.ts). Wildcard DNS on
  // the erken.systems zone already covers these hosts; only the Vercel
  // domain attachment is a separate one-time step per subdomain.
  //
  // sky.erken.systems repointed (PILOT, 2026-08-03) to /sky-erken — the
  // corrected main-site-template rebuild (see /fly-erken for the pattern
  // this was cloned from). The other 16 subdomains stay on the old
  // /demo/[industry] template until Shamil approves this pilot and
  // replication begins; the old page is still reachable directly at
  // /demo/skydiving.
  "sky.erken.systems": "/sky-erken",
  // 2026-08-03: replication wave — auto/moto/bjj/gym repointed to the
  // sky-erken pattern (homepage-clone rebuild) following owner approval of
  // the pilot. Old /demo/[industry] pages stay reachable directly.
  "auto.erken.systems": "/auto-erken",
  "moto.erken.systems": "/moto-erken",
  "bjj.erken.systems": "/bjj-erken",
  "gym.erken.systems": "/gym-erken",
  "surf.erken.systems": "/demo/surf",
  "tennis.erken.systems": "/demo/tennis",
  "farm.erken.systems": "/demo/farm",
  "climb.erken.systems": "/demo/climbing",
  "yacht.erken.systems": "/demo/yacht",
  "ski.erken.systems": "/demo/ski",
  "horse.erken.systems": "/demo/horse",
  "shoot.erken.systems": "/demo/shooting",
  // 2026-08-03: replication batch (w4) — repointed to the main-site-
  // template rebuilds, same pattern as sky.erken.systems above. Old
  // /demo/[industry] pages stay reachable directly.
  "hotel.erken.systems": "/hotel-erken",
  "cafe.erken.systems": "/cafe-erken",
  "fix.erken.systems": "/fix-erken",
  "make.erken.systems": "/make-erken",
};

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const demoPath = DEMO_HOST_ROOTS[host];
  if (demoPath) {
    return NextResponse.rewrite(new URL(demoPath, request.url));
  }
}

export const config = {
  matcher: "/",
};
