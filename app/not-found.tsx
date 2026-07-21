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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-24">
      <div className="animate-in-subtle">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Route not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No module is mapped to this path.
        </p>
        <Link
          href="/"
          className="group mt-6 inline-flex items-center gap-2 text-xs font-medium text-foreground transition-colors hover:text-progress"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to roadmap
        </Link>
      </div>
    </div>
  );
}
