"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Lock } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Metric,
  Panel,
  PanelHeader,
  ProgressBar,
  StatusChip,
} from "@/components/primitives";
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
    <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
      <div className="animate-in-subtle">
        <Breadcrumbs items={[{ label: `Phase ${phase.id}` }]} />

        <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                Phase {String(phase.id).padStart(2, "0")}
              </span>
              <StatusChip status={phase.status} />
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {isPhase0 ? "CompTIA Security+ (SY0-701)" : phase.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {isPhase0
                ? "Open a domain to track completion and keep notes. Progress is weighted by official exam percentages."
                : phase.focus.join(" · ")}
            </p>
          </div>
        </header>

        {isPhase0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {/* Domain list */}
            <Panel className="lg:col-span-2">
              <PanelHeader
                title="Exam domains"
                action={
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
                }
              />
              <ul>
                {SY0701_DOMAINS.map((domain, i) => {
                  const done = !!checklist[domain.id];
                  return (
                    <li
                      key={domain.id}
                      className={cn(i !== 0 && "border-t border-zinc-800/50")}
                    >
                      <div className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-zinc-800/25">
                        {/* Toggle stays a button so the row link isn't hijacked */}
                        <button
                          type="button"
                          aria-label={
                            done ? "Mark incomplete" : "Mark complete"
                          }
                          onClick={() =>
                            setChecklist((prev) => ({
                              ...prev,
                              [domain.id]: !prev[domain.id],
                            }))
                          }
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            done
                              ? "border-progress bg-progress text-background"
                              : "border-zinc-700 hover:border-zinc-500"
                          )}
                        >
                          {done && <Check className="h-2.5 w-2.5" />}
                        </button>

                        <Link
                          href={`/phase/0/domain/${domain.id}`}
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            {/* Summary rail */}
            <div className="space-y-4">
              <Panel>
                <PanelHeader title="Progress" />
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-3xl font-medium tracking-tight text-foreground">
                      {progress}
                      <span className="text-xl text-muted-foreground">%</span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {doneCount}/5
                    </span>
                  </div>
                  <ProgressBar value={progress} className="mt-4" />

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-4">
                    <Metric label="Completed" value={`${doneCount}`} />
                    <Metric label="Remaining" value={`${5 - doneCount}`} />
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHeader title="Focus" />
                <ul className="divide-y divide-zinc-800/50">
                  {phase.focus.map((f) => (
                    <li
                      key={f}
                      className="px-5 py-3 text-xs leading-relaxed text-muted-foreground"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        ) : (
          /* Locked / pending phases */
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <PanelHeader title="Module locked" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="text-sm">
                    {phase.status === "pending" ? "Pending" : "Locked"}
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Complete Phase 00 (Security+ SY0-701) to unlock this module.
                </p>
                {phase.project && (
                  <p className="mt-4 text-xs text-muted-foreground/70">
                    Project: {phase.project}
                  </p>
                )}
                <Link
                  href="/phase/0"
                  className="group mt-5 inline-flex items-center gap-1.5 rounded-md border border-zinc-800/50 bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-zinc-700 hover:bg-zinc-800/50"
                >
                  Go to active phase
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Focus" />
              <ul className="divide-y divide-zinc-800/50">
                {phase.focus.map((f) => (
                  <li
                    key={f}
                    className="px-5 py-3 text-xs leading-relaxed text-muted-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
