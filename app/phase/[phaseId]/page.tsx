"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Circle,
  NotebookPen,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Breadcrumbs } from "@/components/breadcrumbs";
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

  const Icon = phase.icon;
  const isPhase0 = phase.id === 0;
  const progress = phase0Progress(checklist);
  const doneCount = SY0701_DOMAINS.filter((d) => checklist[d.id]).length;

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="cyber-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-6 py-12 space-y-10">
        <Breadcrumbs items={[{ label: `Phase ${phase.id} — ${phase.title}` }]} />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between gap-6"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
              Phase {phase.id}
            </p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight">
              <Icon className="h-7 w-7 text-emerald-400" />
              {isPhase0 ? (
                <>
                  Security+{" "}
                  <span className="font-mono text-emerald-300">SY0-701</span>{" "}
                  Workspace
                </>
              ) : (
                phase.title
              )}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-400 leading-relaxed">
              {isPhase0
                ? "Pick a domain to open its dedicated study page — track completion and keep notes per chapter. Progress is weighted by official exam percentages."
                : `Focus: ${phase.focus.join(" · ")}`}
            </p>
          </div>
          {isPhase0 && (
            <div className="shrink-0 text-right">
              <p className="font-mono text-3xl font-bold text-emerald-300 text-glow tabular-nums">
                {progress}%
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {doneCount}/5 domains
              </p>
            </div>
          )}
        </motion.header>

        {isPhase0 ? (
          <>
            <Progress
              value={progress}
              className="h-2 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-cyan-400"
            />

            {/* Domain menu */}
            <section className="space-y-3">
              {SY0701_DOMAINS.map((domain, i) => {
                const done = !!checklist[domain.id];
                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <Link
                      href={`/phase/0/domain/${domain.id}`}
                      className="group block"
                    >
                      <Card
                        className={cn(
                          "border-slate-800/80 bg-card/60 backdrop-blur transition-all group-hover:border-emerald-500/40 group-hover:bg-emerald-500/[0.03]",
                          done && "border-emerald-500/30 bg-emerald-500/[0.04]"
                        )}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-slate-700" />
                          )}
                          <span className="font-mono text-sm text-slate-500 w-9 shrink-0">
                            {domain.code}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                done ? "text-emerald-200" : "text-slate-200"
                              )}
                            >
                              {domain.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {domain.summary}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] text-slate-400 border-slate-700 tabular-nums shrink-0"
                          >
                            {domain.weight}%
                          </Badge>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </section>

            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <NotebookPen className="h-3.5 w-3.5" />
                Each domain page has its own persistent study notes.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                onClick={() =>
                  setChecklist(
                    doneCount === 5
                      ? {}
                      : Object.fromEntries(
                          SY0701_DOMAINS.map((d) => [d.id, true])
                        )
                  )
                }
              >
                {doneCount === 5 ? "Reset domains" : "Mark all done"}
              </Button>
            </div>
          </>
        ) : (
          /* Locked / pending phases */
          <Card className="border-slate-800/80 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-slate-500" />
                This phase is {phase.status === "pending" ? "pending" : "locked"}
              </CardTitle>
              <CardDescription>
                Complete Phase 0 (Security+ SY0-701) to unlock this module.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {phase.focus.map((f) => (
                <p key={f} className="text-sm text-slate-400">
                  · {f}
                </p>
              ))}
              {phase.project && (
                <p className="pt-1 text-sm text-cyan-300/90">
                  Project: {phase.project}
                </p>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-4 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
              >
                <Link href="/phase/0">
                  <ShieldCheck className="h-4 w-4" />
                  Go to the active phase
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
