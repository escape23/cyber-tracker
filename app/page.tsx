"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Terminal,
  GitBranch,
  Database,
  Gauge,
  FileCode2,
  ExternalLink,
  Crosshair,
  ArrowRight,
  Bug,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PHASES,
  SY0701_DOMAINS,
  CHECKLIST_STORAGE_KEY,
  phase0Progress,
  globalProgress,
  type Checklist,
  type PhaseStatus,
} from "@/lib/roadmap";
import { useLocalStorage } from "@/hooks/use-local-storage";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: PhaseStatus }) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        ACTIVE
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
        PENDING
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-slate-500 border-slate-700 gap-1">
      <Lock className="h-3 w-3" />
      LOCKED
    </Badge>
  );
}

function ProgressRing({ value }: { value: number }) {
  const size = 176;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#131c2e"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - value / 100) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.55))" }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-bold text-emerald-300 text-glow tabular-nums">
          {value.toFixed(1)}
          <span className="text-xl text-emerald-400/70">%</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mt-1">
          Roadmap
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [checklist] = useLocalStorage<Checklist>(CHECKLIST_STORAGE_KEY, {});

  const doneCount = SY0701_DOMAINS.filter((d) => checklist[d.id]).length;
  const phaseProgress = phase0Progress(checklist);
  const roadmapProgress = globalProgress(checklist);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="cyber-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-14 space-y-16">
        {/* ---------------------------------------------------------- */}
        {/* HERO                                                        */}
        {/* ---------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between"
        >
          <div className="max-w-xl text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-mono text-emerald-300">
              <Terminal className="h-3.5 w-3.5" />
              ~/cyber-tracker <span className="text-slate-500">·</span>
              <span className="text-slate-400">phase_0 running</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Cybersecurity{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Learning Tracker
              </span>
            </h1>
            <p className="mt-4 text-slate-400 leading-relaxed">
              A five-phase roadmap from Security+ fundamentals to AppSec,
              OT/ICS, cloud security and GRC — tracked domain by domain,
              backed by proof of work.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <div>
                <p className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
                  {doneCount}/5
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  SY0-701 domains
                </p>
              </div>
              <Separator orientation="vertical" className="h-10 bg-slate-800" />
              <div>
                <p className="font-mono text-2xl font-bold text-cyan-300 tabular-nums">
                  1/5
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  phases active
                </p>
              </div>
              <Separator orientation="vertical" className="h-10 bg-slate-800" />
              <div>
                <p className="font-mono text-2xl font-bold text-slate-200 tabular-nums">
                  {phaseProgress}%
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  phase 0 · exam weight
                </p>
              </div>
            </div>
          </div>

          <ProgressRing value={roadmapProgress} />
        </motion.section>

        {/* ---------------------------------------------------------- */}
        {/* ROADMAP STEPPER                                             */}
        {/* ---------------------------------------------------------- */}
        <section className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-slate-500">
            <GitBranch className="h-4 w-4 text-emerald-400" />
            Roadmap — Phases 0→4
          </h2>

          <ol className="relative space-y-2 border-l border-slate-800 pl-6 ml-3">
            {PHASES.map((phase, i) => {
              const Icon = phase.icon;
              const isActive = phase.status === "active";
              return (
                <motion.li
                  key={phase.id}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative pb-6 last:pb-0"
                >
                  <span
                    className={cn(
                      "absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full border bg-background",
                      isActive
                        ? "border-emerald-400 text-emerald-300 glow-emerald"
                        : phase.status === "pending"
                          ? "border-cyan-500/50 text-cyan-400"
                          : "border-slate-700 text-slate-600"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  <Card
                    className={cn(
                      "border-slate-800/80 bg-card/60 backdrop-blur transition-colors",
                      isActive &&
                        "border-emerald-500/40 bg-emerald-500/[0.04] glow-emerald"
                    )}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm">
                          <span className="font-mono text-slate-500 mr-2">
                            P{phase.id}
                          </span>
                          {phase.title}
                        </CardTitle>
                        <StatusBadge status={phase.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-1.5">
                      {phase.focus.map((f) => (
                        <p
                          key={f}
                          className="flex items-center gap-2 text-xs text-slate-400"
                        >
                          <Crosshair className="h-3 w-3 shrink-0 text-slate-600" />
                          {f}
                        </p>
                      ))}
                      {phase.project && (
                        <p className="flex items-center gap-2 text-xs text-cyan-300/90 pt-1">
                          <FileCode2 className="h-3 w-3 shrink-0" />
                          Project: {phase.project}
                        </p>
                      )}
                      {isActive && (
                        <div className="space-y-3 pt-2">
                          <Progress
                            value={phaseProgress}
                            className="h-1.5 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-cyan-400"
                          />
                          <Button
                            asChild
                            size="sm"
                            className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                          >
                            <Link href="/phase/0">
                              <ShieldCheck className="h-4 w-4" />
                              Open Security+ Workspace
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* PROOF OF WORK                                               */}
        {/* ---------------------------------------------------------- */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-slate-500">
            <Gauge className="h-4 w-4 text-cyan-400" />
            Proof of Work
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Featured: MarginFlow Security Review */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="h-full border-cyan-500/30 bg-gradient-to-br from-cyan-500/[0.06] via-card/70 to-card/70 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-cyan-400" />
                      MarginFlow Security Review
                    </CardTitle>
                    <Badge className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/40">
                      FEATURED
                    </Badge>
                  </div>
                  <CardDescription>
                    Hardening a production SaaS: threat-modeling the data layer
                    and API surface, then shipping the fixes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Lock className="h-4 w-4 text-emerald-400" />
                        Row-Level Security (RLS)
                      </p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Postgres RLS policies for tenant isolation — every table
                        scoped to the authenticated org.
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Gauge className="h-4 w-4 text-emerald-400" />
                        Rate Limiting
                      </p>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        Per-user and per-IP throttling on auth and API routes to
                        blunt brute-force and abuse.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] border-slate-700 text-slate-400"
                    >
                      OWASP A01
                    </Badge>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] border-slate-700 text-slate-400"
                    >
                      OWASP A04
                    </Badge>
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] border-slate-700 text-slate-400"
                    >
                      Phase 1 deliverable
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Side stack */}
            <div className="grid gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-slate-800/80 bg-card/60 backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Terminal className="h-4 w-4 text-emerald-400" />
                      TryHackMe — Cyber Security 101
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-500">
                      Hands-on labs running alongside Security+ study.
                    </p>
                    <Badge className="mt-3 bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                      IN PROGRESS
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-slate-800/80 bg-card/60 backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bug className="h-4 w-4 text-slate-500" />
                      PortSwigger Lab Writeups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-500">
                      Web Security Academy labs, documented as writeups.
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-3 text-slate-500 border-slate-700 gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      UNLOCKS IN PHASE 1
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/* FOOTER                                                      */}
        {/* ---------------------------------------------------------- */}
        <footer className="flex items-center justify-between border-t border-slate-800/70 pt-6 text-xs text-slate-600">
          <p className="font-mono">
            cyber-tracker <span className="text-slate-700">v0.2.0</span>
          </p>
          <p className="flex items-center gap-1.5 font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            status: learning
            <ExternalLink className="h-3 w-3 text-slate-700" />
          </p>
        </footer>
      </div>
    </main>
  );
}
