import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Applied to every response, including static assets and 404s.
 *
 * NOTE: Content-Security-Policy is deliberately NOT set here — it is issued
 * per-request by `proxy.ts` so each response carries a fresh nonce. If a CSP
 * were also set here, browsers would enforce BOTH policies as an intersection
 * and this static one (lacking the nonce) would re-block the very inline
 * scripts the nonce exists to allow, breaking hydration.
 */
const securityHeaders = [
  // Belt-and-braces with CSP frame-ancestors, for pre-CSP browsers.
  { key: "X-Frame-Options", value: "DENY" },
  // Stops MIME-sniffing turning a .txt upload into executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL same-origin, bare origin cross-origin, nothing to http.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny every powerful browser API — this app needs none of them.
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "usb=()",
      "xr-spatial-tracking=()",
      "browsing-topics=()",
    ].join(", "),
  },
  // Cross-origin isolation: severs the window.opener channel and blocks
  // other origins from embedding our resources (Spectre / XS-Leaks).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  // Don't leak internal hostnames via speculative DNS lookups.
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  // Never advertise the framework version to attackers fingerprinting targets.
  poweredByHeader: false,
  // Deny-by-default for trailing-slash URL ambiguity / cache poisoning.
  trailingSlash: false,
  // Fail the production build on type errors rather than shipping unverified
  // code — must never be silently ignored. (Next.js 16 removed the `eslint`
  // config key; linting runs as its own step via `npm run lint`.)
  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        // Every path, including /_next/static and error pages.
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // HSTS is meaningless (and unsettable) over plain http in dev;
          // only emit it in production, where Vercel terminates TLS.
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
