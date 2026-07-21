"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Lock } from "lucide-react";

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
import {
  Metric,
  Panel,
  PanelHeader,
  ProgressBar,
  StatusChip,
} from "@/components/primitives";

export default function Dashboard() {
  const [checklist] = useLocalStorage<Checklist>(CHECKLIST_STORAGE_KEY, {});

  const doneCount = SY0701_DOMAINS.filter((d) => checklist[d.id]).length;
  const phaseProgress = phase0Progress(checklist);
  const roadmapProgress = globalProgress(checklist);
  const remainingWeight = 100 - phaseProgress;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
      <div className="animate-in-subtle">
        {/* Page header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Five phases from Security+ fundamentals through AppSec, OT/ICS,
              cloud and GRC.
            </p>
          </div>
          <Link
            href="/phase/0"
            className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800/50 bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
          >
            Open active phase
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        {/* Top row: progress + snapshot */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <PanelHeader
              title="Overall progress"
              action={
                <span className="font-mono text-[11px] text-muted-foreground">
                  weighted by exam %
                </span>
              }
            />
            <div className="p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl font-medium tracking-tight text-foreground">
                  {roadmapProgress.toFixed(1)}
                  <span className="text-2xl text-muted-foreground">%</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  roadmap complete
                </span>
              </div>
              <ProgressBar value={roadmapProgress} className="mt-5" />

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-5 sm:grid-cols-4">
                <Metric label="Domains done" value={`${doneCount}/5`} />
                <Metric label="Phases active" value="1/5" />
                <Metric label="Phase 00 weight" value={`${phaseProgress}%`} />
                <Metric label="Weight remaining" value={`${remainingWeight}%`} />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Current focus" />
            <div className="p-5">
              <p className="font-mono text-xs text-muted-foreground">
                Phase 00
              </p>
              <h3 className="mt-1.5 text-sm font-medium text-foreground">
                CompTIA Security+
              </h3>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                SY0-701
              </p>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-mono text-2xl font-medium text-foreground">
                  {phaseProgress}%
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {doneCount}/5
                </span>
              </div>
              <ProgressBar value={phaseProgress} className="mt-3" />

              <div className="mt-5 space-y-2 border-t border-zinc-800/50 pt-4">
                <p className="text-xs text-muted-foreground">
                  TryHackMe — Cyber Security 101
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-progress">
                  <span className="h-1 w-1 rounded-full bg-progress" />
                  In progress
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Middle row: active module + proof of work */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <PanelHeader
              title="Active module — exam domains"
              action={
                <Link
                  href="/phase/0"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                </Link>
              }
            />
            <ul>
              {SY0701_DOMAINS.map((domain, i) => {
                const done = !!checklist[domain.id];
                return (
                  <li
                    key={domain.id}
                    className={cn(
                      i !== 0 && "border-t border-zinc-800/50"
                    )}
                  >
                    <Link
                      href={`/phase/0/domain/${domain.id}`}
                      className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-zinc-800/25"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                          done
                            ? "border-progress bg-progress text-background"
                            : "border-zinc-700"
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
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Proof of work" />
            <div className="divide-y divide-zinc-800/50">
              <article className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium text-foreground">
                    MarginFlow Security Review
                  </h3>
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Postgres row-level security for tenant isolation, plus
                  per-user and per-IP rate limiting on auth and API routes.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["OWASP A01", "OWASP A04", "Phase 1"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              <article className="flex items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    PortSwigger writeups
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">
                    Web Security Academy labs
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground/70">
                  Phase 1
                </span>
              </article>
            </div>
          </Panel>
        </div>

        {/* Bottom row: full roadmap */}
        <section className="mt-4">
          <Panel>
            <PanelHeader title="Roadmap" />
            <div className="grid gap-px bg-zinc-800/50 sm:grid-cols-2 xl:grid-cols-5">
              {PHASES.map((phase) => {
                const isActive = phase.status === "active";
                return (
                  <Link
                    key={phase.id}
                    href={`/phase/${phase.id}`}
                    className="group flex flex-col bg-zinc-900/40 p-5 transition-colors hover:bg-zinc-800/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground/60">
                        {String(phase.id).padStart(2, "0")}
                      </span>
                      <StatusChip status={phase.status} />
                    </div>

                    <h3
                      className={cn(
                        "mt-3 text-sm font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {phase.title}
                    </h3>

                    <ul className="mt-2 flex-1 space-y-1">
                      {phase.focus.map((f) => (
                        <li
                          key={f}
                          className="text-xs leading-relaxed text-muted-foreground/70"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isActive ? (
                      <div className="mt-4">
                        <ProgressBar value={phaseProgress} />
                        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                          {phaseProgress}%
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center gap-1.5 text-muted-foreground/40">
                        <Lock className="h-3 w-3" />
                        <span className="text-[11px]">Not started</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
