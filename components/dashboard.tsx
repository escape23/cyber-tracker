"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PHASES,
  SY0701_DOMAINS,
  CHECKLIST_STORAGE_KEY,
  phase0Progress,
  globalProgress,
  type Checklist,
} from "@/lib/roadmap";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ProgressBar, SectionLabel, StatusChip } from "@/components/primitives";

/** Label + monospaced value. Used for the metric row under the hero. */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-sm text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [checklist] = useLocalStorage<Checklist>(CHECKLIST_STORAGE_KEY, {});

  const doneCount = SY0701_DOMAINS.filter((d) => checklist[d.id]).length;
  const phaseProgress = phase0Progress(checklist);
  const roadmapProgress = globalProgress(checklist);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-24">
      <div className="animate-in-subtle">
        {/* Header */}
        <header>
          <p className="font-mono text-xs text-muted-foreground">
            cyber-tracker
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Security Roadmap
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Five phases from Security+ fundamentals through AppSec, OT/ICS,
            cloud and GRC.
          </p>
        </header>

        {/* Global progress */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-4xl font-medium tracking-tight text-foreground">
              {roadmapProgress.toFixed(1)}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
            <span className="text-xs text-muted-foreground">
              roadmap complete
            </span>
          </div>
          <ProgressBar value={roadmapProgress} className="mt-4" />

          <div className="mt-6 grid grid-cols-3 gap-6 border-t border-border/40 pt-6">
            <Metric label="Domains done" value={`${doneCount}/5`} />
            <Metric label="Phases active" value="1/5" />
            <Metric label="Exam weight" value={`${phaseProgress}%`} />
          </div>
        </section>

        {/* Phases */}
        <section className="mt-14">
          <SectionLabel>Phases</SectionLabel>

          <ol className="mt-4 border-t border-border/40">
            {PHASES.map((phase) => {
              const isActive = phase.status === "active";
              return (
                <li
                  key={phase.id}
                  className="border-b border-border/40 py-5 first:pt-5"
                >
                  <div className="flex gap-4">
                    <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground/60">
                      {String(phase.id).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          className={cn(
                            "text-sm font-medium",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {phase.title}
                        </h3>
                        <StatusChip status={phase.status} />
                      </div>

                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {phase.focus.join(" · ")}
                      </p>

                      {phase.project && (
                        <p className="mt-1 text-xs text-muted-foreground/70">
                          {phase.project}
                        </p>
                      )}

                      {isActive && (
                        <div className="mt-4 space-y-3">
                          <ProgressBar value={phaseProgress} />
                          <Link
                            href="/phase/0"
                            className="group inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-progress"
                          >
                            Open Security+ workspace
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Proof of work */}
        <section className="mt-14">
          <SectionLabel>Proof of work</SectionLabel>

          <div className="mt-4 space-y-px overflow-hidden rounded-lg border border-border/40">
            <article className="bg-card/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-foreground">
                  MarginFlow Security Review
                </h3>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Hardening a production SaaS — Postgres row-level security for
                tenant isolation, plus per-user and per-IP rate limiting on auth
                and API routes.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["OWASP A01", "OWASP A04", "Phase 1"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            <article className="flex items-center justify-between gap-4 border-t border-border/40 bg-card/40 p-5">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-foreground">
                  TryHackMe — Cyber Security 101
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hands-on labs alongside Security+ study.
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-medium text-progress">
                In progress
              </span>
            </article>

            <article className="flex items-center justify-between gap-4 border-t border-border/40 bg-card/40 p-5">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-muted-foreground">
                  PortSwigger lab writeups
                </h3>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Web Security Academy labs, documented.
                </p>
              </div>
              <span className="shrink-0 text-[11px] font-medium text-muted-foreground/70">
                Phase 1
              </span>
            </article>
          </div>
        </section>

        <footer className="mt-14 border-t border-border/40 pt-6">
          <p className="font-mono text-xs text-muted-foreground/60">
            cyber-tracker v0.3.0
          </p>
        </footer>
      </div>
    </div>
  );
}
