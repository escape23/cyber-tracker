import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request nonce-based Content-Security-Policy.
 *
 * Next.js emits inline bootstrap/hydration scripts, so a bare
 * `script-src 'self'` blocks hydration and leaves a dead page. The two ways
 * to allow them are `'unsafe-inline'` (which defeats CSP's XSS protection
 * entirely) or a fresh per-request nonce. We use the nonce: Next.js reads it
 * from this header and stamps it onto every script tag it renders.
 *
 * `'strict-dynamic'` lets those nonced scripts load the chunks they need
 * without us enumerating hashes, while still refusing anything an injected
 * tag tries to pull in.
 */
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    // In dev, Turbopack's HMR client needs eval + inline; never in production.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
      isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""
    }`,
    // 'unsafe-inline' is unavoidable for styles: React's style={{}} prop and
    // Framer Motion both write inline style *attributes*, which nonces and
    // hashes cannot cover. Deliberately scoped to styles only — script-src,
    // which is what actually stops XSS execution, stays strict.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "manifest-src 'self'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  // Next.js reads the nonce off the *request* headers during rendering.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Documents only. Static assets are hash-named and immutable, and
      // carry their own headers from next.config.ts.
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      // Prefetches don't execute scripts, so they don't need a nonce.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
