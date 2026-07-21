import { connection } from "next/server";

import Dashboard from "@/components/dashboard";

/**
 * Server wrapper that opts this route into dynamic rendering.
 *
 * The nonce-based CSP in `proxy.ts` is generated per request, so a page
 * prerendered at build time would ship HTML whose script tags carry a stale
 * nonce (or none at all) and would be blocked by the browser. `connection()`
 * defers rendering until a request exists, so Next.js can stamp the current
 * request's nonce onto every script it emits.
 */
export default async function Home() {
  await connection();
  return <Dashboard />;
}
