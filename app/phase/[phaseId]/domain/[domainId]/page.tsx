"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  NotebookPen,
  Save,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import {
  SY0701_DOMAINS,
  CHECKLIST_STORAGE_KEY,
  noteStorageKey,
  type Checklist,
} from "@/lib/roadmap";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function DomainPage({
  params,
}: {
  params: Promise<{ phaseId: string; domainId: string }>;
}) {
  const { phaseId, domainId } = React.use(params);

  const domainIndex = SY0701_DOMAINS.findIndex((d) => d.id === domainId);
  const domain = SY0701_DOMAINS[domainIndex];

  const [checklist, setChecklist] = useLocalStorage<Checklist>(
    CHECKLIST_STORAGE_KEY,
    {}
  );
  const [savedNotes, setSavedNotes] = useLocalStorage<string>(
    noteStorageKey(domainId),
    ""
  );

  /* Draft is derived: null means "not editing, show the stored notes".
     This avoids syncing state in an effect and stays hydration-safe —
     the textarea simply re-renders once the stored value loads. */
  const [draftState, setDraftState] = React.useState<string | null>(null);
  const [justSaved, setJustSaved] = React.useState(false);

  const draft = draftState ?? savedNotes;
  const dirty = draftState !== null && draftState !== savedNotes;

  /* Domain pages only exist under Phase 0 */
  if (phaseId !== "0" || !domain) notFound();

  const done = !!checklist[domain.id];
  const prev = SY0701_DOMAINS[domainIndex - 1];
  const next = SY0701_DOMAINS[domainIndex + 1];

  const saveNotes = () => {
    setSavedNotes(draft);
    setDraftState(null);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="cyber-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-3xl px-6 py-12 space-y-8">
        <Breadcrumbs
          items={[
            { label: "Phase 0 — Foundation", href: "/phase/0" },
            { label: `Domain ${domain.code}` },
          ]}
        />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-slate-500">
              SY0-701 · Domain {domain.code}
            </span>
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-slate-400 border-slate-700 tabular-nums"
            >
              {domain.weight}% of exam
            </Badge>
            {done && (
              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                COMPLETE
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {domain.name}
          </h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            {domain.summary}
          </p>
        </motion.header>

        {/* Completion toggle */}
        <label
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all",
            done
              ? "border-emerald-500/40 bg-emerald-500/[0.06]"
              : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
          )}
        >
          <Checkbox
            checked={done}
            onCheckedChange={() =>
              setChecklist((prevList) => ({
                ...prevList,
                [domain.id]: !prevList[domain.id],
              }))
            }
            className="border-slate-600 data-[state=checked]:border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-emerald-950"
          />
          <span
            className={cn(
              "text-sm",
              done ? "text-emerald-200" : "text-slate-300"
            )}
          >
            Mark this domain as complete
          </span>
        </label>

        {/* Key topics */}
        <Card className="border-slate-800/80 bg-card/60 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              Key Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {domain.topics.map((topic) => (
              <p
                key={topic}
                className="flex items-center gap-2.5 text-sm text-slate-300"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                {topic}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Study notes */}
        <Card className="border-emerald-500/30 bg-card/70 backdrop-blur glow-emerald">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <NotebookPen className="h-4 w-4 text-emerald-400" />
              Study Notes
            </CardTitle>
            <CardDescription>
              Saved in your browser under{" "}
              <code className="font-mono text-[11px] text-slate-400">
                {noteStorageKey(domain.id)}
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraftState(e.target.value)}
              placeholder={`# Domain ${domain.code} — ${domain.name}\n\nAcronyms, gotchas, PBQ tricks, links...`}
              className="min-h-64 resize-y border-slate-800 bg-slate-950/60 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus-visible:ring-emerald-500/50"
            />
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-slate-600 tabular-nums">
                {draft.length} chars
                {dirty && (
                  <span className="ml-2 text-amber-400/90">● unsaved</span>
                )}
                {justSaved && !dirty && (
                  <span className="ml-2 text-emerald-400">✓ saved</span>
                )}
              </p>
              <Button
                onClick={saveNotes}
                disabled={!dirty}
                size="sm"
                className="bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="bg-slate-800" />

        {/* Prev / next navigation */}
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <Link href={`/phase/0/domain/${prev.id}`}>
                <ArrowLeft className="h-4 w-4" />
                {prev.code} {prev.name}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <Link href={`/phase/0/domain/${next.id}`}>
                {next.code} {next.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  );
}
