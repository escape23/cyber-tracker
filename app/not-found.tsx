import Link from "next/link";
import { connection } from "next/server";
import { ShieldAlert, LayoutDashboard } from "lucide-react";

/**
 * Custom 404.
 *
 * Also opts out of prerendering via `connection()`: Next.js's built-in
 * `/_not-found` is generated at build time, so its script tags never receive
 * the per-request nonce from `proxy.ts` and the browser blocks every one of
 * them. Rendering on demand lets the nonce be applied like any other route.
 */
export default async function NotFound() {
  await connection();

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
      <div className="cyber-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-emerald-400" />
        <p className="mt-6 font-mono text-6xl font-bold tabular-nums text-emerald-300 text-glow">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-100">
          Route not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
          No module is mapped to this path. It may have been moved, or the
          phase you are looking for does not exist yet.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-sm text-emerald-300 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
