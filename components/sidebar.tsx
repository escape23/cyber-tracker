"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PHASES,
  SY0701_DOMAINS,
  CHECKLIST_STORAGE_KEY,
  globalProgress,
  type Checklist,
} from "@/lib/roadmap";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ProgressBar } from "@/components/primitives";

/** Shared nav model so the desktop rail and mobile bar can't drift apart. */
function useNavState() {
  const pathname = usePathname();
  const [checklist] = useLocalStorage<Checklist>(CHECKLIST_STORAGE_KEY, {});

  return {
    pathname,
    checklist,
    progress: globalProgress(checklist),
    isDashboard: pathname === "/",
    // Matches /phase/0 and every nested /phase/0/domain/* route.
    phaseHref: (id: number) => `/phase/${id}`,
    isPhaseActive: (id: number) =>
      pathname === `/phase/${id}` || pathname.startsWith(`/phase/${id}/`),
  };
}

export function Sidebar() {
  const nav = useNavState();
  const doneCount = SY0701_DOMAINS.filter((d) => nav.checklist[d.id]).length;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-zinc-800/50 bg-zinc-900/20 lg:flex">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-zinc-800/50 px-5">
        <Link
          href="/"
          className="font-mono text-sm text-foreground transition-colors hover:text-progress"
        >
          cyber<span className="text-muted-foreground">-tracker</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
            nav.isDashboard
              ? "bg-zinc-800/60 text-foreground"
              : "text-muted-foreground hover:bg-zinc-800/30 hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Dashboard
        </Link>

        <p className="mt-6 px-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60">
          Phases
        </p>

        <ul className="mt-2 space-y-0.5">
          {PHASES.map((phase) => {
            const active = nav.isPhaseActive(phase.id);
            const locked = phase.status !== "active";
            return (
              <li key={phase.id}>
                <Link
                  href={nav.phaseHref(phase.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-zinc-800/60 text-foreground"
                      : "text-muted-foreground hover:bg-zinc-800/30 hover:text-foreground"
                  )}
                >
                  <span className="w-5 shrink-0 font-mono text-[11px] text-muted-foreground/50">
                    {String(phase.id).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{phase.title}</span>
                  {phase.status === "active" ? (
                    <span className="h-1 w-1 shrink-0 rounded-full bg-progress" />
                  ) : (
                    locked && (
                      <Lock className="h-3 w-3 shrink-0 text-muted-foreground/30" />
                    )
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Global progress footer */}
      <div className="border-t border-zinc-800/50 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-muted-foreground">Roadmap</span>
          <span className="font-mono text-xs text-foreground">
            {nav.progress.toFixed(1)}%
          </span>
        </div>
        <ProgressBar value={nav.progress} className="mt-2" />
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">
          {doneCount}/5 domains
        </p>
      </div>
    </aside>
  );
}

/** Horizontally scrollable nav shown below the `lg` breakpoint. */
export function MobileNav() {
  const nav = useNavState();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/50 bg-background/80 backdrop-blur lg:hidden">
      <div className="flex h-14 items-center justify-between px-5">
        <Link href="/" className="font-mono text-sm text-foreground">
          cyber<span className="text-muted-foreground">-tracker</span>
        </Link>
        <span className="font-mono text-xs text-muted-foreground">
          {nav.progress.toFixed(1)}%
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto px-3 pb-2">
        <Link
          href="/"
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors",
            nav.isDashboard
              ? "bg-zinc-800/60 text-foreground"
              : "text-muted-foreground"
          )}
        >
          Dashboard
        </Link>
        {PHASES.map((phase) => (
          <Link
            key={phase.id}
            href={nav.phaseHref(phase.id)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors",
              nav.isPhaseActive(phase.id)
                ? "bg-zinc-800/60 text-foreground"
                : "text-muted-foreground"
            )}
          >
            <span className="font-mono text-muted-foreground/50">
              {String(phase.id).padStart(2, "0")}
            </span>{" "}
            {phase.title}
          </Link>
        ))}
      </div>
    </header>
  );
}
