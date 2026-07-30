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
