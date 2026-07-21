"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProgressBar, SectionLabel } from "@/components/primitives";
import { cn } from "@/lib/utils";
import {
  PHASES,
  SY0701_DOMAINS,
  CHECKLIST_STORAGE_KEY,
  phase0Progress,
  type Checklist,
} from "@/lib/roadmap";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function PhasePage({
  params,
}: {
  params: Promise<{ phaseId: string }>;
}) {
  const { phaseId } = React.use(params);
  const phase = PHASES.find((p) => String(p.id) === phaseId);

  const [checklist, setChecklist] = useLocalStorage<Checklist>(
    CHECKLIST_STORAGE_KEY,
    {}
  );

  if (!phase) notFound();

  const isPhase0 = phase.id === 0;
  const progress = phase0Progress(checklist);
  const doneCount = SY0701_DOMAINS.filter((d) => checklist[d.id]).length;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
      <div className="animate-in-subtle">
        <Breadcrumbs items={[{ label: `Phase ${phase.id}` }]} />

        <header className="mt-8">
          <p className="font-mono text-xs text-muted-foreground">
            Phase {String(phase.id).padStart(2, "0")}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {isPhase0 ? "CompTIA Security+" : phase.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isPhase0
              ? "Open a domain to track completion and keep notes. Progress is weighted by official exam percentages."
              : phase.focus.join(" · ")}
          </p>
        </header>

        {isPhase0 ? (
          <>
            <section className="mt-10">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-3xl font-medium tracking-tight text-foreground">
                  {progress}
                  <span className="text-xl text-muted-foreground">%</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {doneCount}/5 domains
                </span>
              </div>
              <ProgressBar value={progress} className="mt-4" />
            </section>

            <section className="mt-12">
              <div className="flex items-center justify-between">
                <SectionLabel>Exam domains</SectionLabel>
                <button
                  type="button"
                  onClick={() =>
                    setChecklist(
                      doneCount === 5
                        ? {}
                        : Object.fromEntries(
                            SY0701_DOMAINS.map((d) => [d.id, true])
                          )
                    )
                  }
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {doneCount === 5 ? "Reset" : "Mark all"}
                </button>
              </div>

              <ul className="mt-4 border-t border-border/40">
                {SY0701_DOMAINS.map((domain) => {
                  const done = !!checklist[domain.id];
                  return (
                    <li key={domain.id} className="border-b border-border/40">
                      <Link
                        href={`/phase/0/domain/${domain.id}`}
                        className="group flex items-center gap-4 py-4 transition-colors hover:bg-white/[0.02]"
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            done
                              ? "border-progress bg-progress text-background"
                              : "border-border"
                          )}
                        >
                          {done && <Check className="h-2.5 w-2.5" />}
                        </span>

                        <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground/60">
                          {domain.code}
                        </span>

                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-sm",
                            done ? "text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {domain.name}
                        </span>

                        <span className="shrink-0 font-mono text-xs text-muted-foreground/60">
                          {domain.weight}%
                        </span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        ) : (
          <section className="mt-10 rounded-lg border border-border/40 bg-card/40 p-6">
            <p className="text-sm text-foreground">
              {phase.status === "pending" ? "Pending" : "Locked"}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Complete Phase 00 (Security+ SY0-701) to unlock this module.
            </p>
            {phase.project && (
              <p className="mt-3 text-xs text-muted-foreground/70">
                {phase.project}
              </p>
            )}
            <Link
              href="/phase/0"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-progress"
            >
              Go to active phase
              <ArrowRight className="h-3 w-3" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
