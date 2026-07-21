"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionLabel } from "@/components/primitives";
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

  /* Draft is derived: null means "not editing, show stored notes". Keeps the
     component hydration-safe without syncing state in an effect. */
  const [draftState, setDraftState] = React.useState<string | null>(null);
  const [justSaved, setJustSaved] = React.useState(false);

  const draft = draftState ?? savedNotes;
  const dirty = draftState !== null && draftState !== savedNotes;

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
    <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
      <div className="animate-in-subtle">
        <Breadcrumbs
          items={[
            { label: "Phase 0", href: "/phase/0" },
            { label: domain.code },
          ]}
        />

        {/* Header */}
        <header className="mt-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {domain.code}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="font-mono text-xs text-muted-foreground">
              {domain.weight}% of exam
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {domain.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {domain.summary}
          </p>
        </header>

        {/* Completion toggle */}
        <button
          type="button"
          onClick={() =>
            setChecklist((prevList) => ({
              ...prevList,
              [domain.id]: !prevList[domain.id],
            }))
          }
          className="mt-8 flex w-full items-center gap-3 rounded-lg border border-border/40 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
        >
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
              done ? "border-progress bg-progress text-background" : "border-border"
            )}
          >
            {done && <Check className="h-2.5 w-2.5" />}
          </span>
          <span
            className={cn(
              "text-sm",
              done ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {done ? "Completed" : "Mark as complete"}
          </span>
        </button>

        {/* Key topics */}
        <section className="mt-12">
          <SectionLabel>Key topics</SectionLabel>
          <ul className="mt-4 border-t border-border/40">
            {domain.topics.map((topic) => (
              <li
                key={topic}
                className="border-b border-border/40 py-3 text-sm text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
        </section>

        {/* Study notes */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <SectionLabel>Study notes</SectionLabel>
            <span className="font-mono text-[11px] text-muted-foreground/60">
              {dirty ? "Unsaved" : justSaved ? "Saved" : "Local only"}
            </span>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraftState(e.target.value)}
            placeholder="Acronyms, gotchas, PBQ tricks, links…"
            spellCheck={false}
            className="mt-4 min-h-56 w-full resize-y rounded-lg border border-border/40 bg-card/40 p-4 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-visible:border-border"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground/60">
              {draft.length} chars
            </span>
            <button
              type="button"
              onClick={saveNotes}
              disabled={!dirty}
              className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              Save notes
            </button>
          </div>
        </section>

        {/* Prev / next */}
        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-border/40 pt-6">
          {prev ? (
            <Link
              href={`/phase/0/domain/${prev.id}`}
              className="group flex min-w-0 items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <span className="truncate">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/phase/0/domain/${next.id}`}
              className="group flex min-w-0 items-center gap-2 text-right text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="truncate">{next.name}</span>
              <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
