import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";

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
    <div className="flex min-h-[70vh] items-center justify-center px-5 lg:px-8">
      <div className="animate-in-subtle w-full max-w-md rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-8">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          Route not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No module is mapped to this path.
        </p>
        <Link
          href="/"
          className="group mt-6 inline-flex items-center gap-2 rounded-md border border-zinc-800/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
