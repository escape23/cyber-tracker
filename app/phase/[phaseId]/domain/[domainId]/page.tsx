"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Panel, PanelHeader } from "@/components/primitives";
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
    <div className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
      <div className="animate-in-subtle">
        <Breadcrumbs
          items={[
            { label: "Phase 0", href: "/phase/0" },
            { label: domain.code },
          ]}
        />

        <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {domain.code}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="font-mono text-xs text-muted-foreground">
                {domain.weight}% of exam
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {domain.name}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {domain.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setChecklist((prevList) => ({
                ...prevList,
                [domain.id]: !prevList[domain.id],
              }))
            }
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              done
                ? "border-progress/40 bg-progress/10 text-progress"
                : "border-zinc-800/50 bg-zinc-900/40 text-foreground hover:border-zinc-700 hover:bg-zinc-800/50"
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                done ? "border-progress bg-progress text-background" : "border-zinc-600"
              )}
            >
              {done && <Check className="h-2 w-2" />}
            </span>
            {done ? "Completed" : "Mark complete"}
          </button>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Notes take the primary column — this is the working surface */}
          <Panel className="lg:col-span-2">
            <PanelHeader
              title="Study notes"
              action={
                <span className="font-mono text-[11px] text-muted-foreground">
                  {dirty ? "Unsaved" : justSaved ? "Saved" : "Local only"}
                </span>
              }
            />
            <div className="p-5">
              <textarea
                value={draft}
                onChange={(e) => setDraftState(e.target.value)}
                placeholder="Acronyms, gotchas, PBQ tricks, links…"
                spellCheck={false}
                className="min-h-[22rem] w-full resize-y rounded-lg border border-zinc-800/50 bg-zinc-950/40 p-4 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-visible:border-zinc-700"
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
            </div>
          </Panel>

          {/* Supporting rail */}
          <div className="space-y-4">
            <Panel>
              <PanelHeader title="Key topics" />
              <ul className="divide-y divide-zinc-800/50">
                {domain.topics.map((topic) => (
                  <li
                    key={topic}
                    className="px-5 py-3 text-xs leading-relaxed text-muted-foreground"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel>
              <PanelHeader title="Navigate" />
              <div className="divide-y divide-zinc-800/50">
                {prev ? (
                  <Link
                    href={`/phase/0/domain/${prev.id}`}
                    className="group flex items-center gap-2.5 px-5 py-3 transition-colors hover:bg-zinc-800/25"
                  >
                    <ArrowLeft className="h-3 w-3 shrink-0 text-muted-foreground/40 transition-transform group-hover:-translate-x-0.5" />
                    <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground/60">
                      {prev.code}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                      {prev.name}
                    </span>
                  </Link>
                ) : null}
                {next ? (
                  <Link
                    href={`/phase/0/domain/${next.id}`}
                    className="group flex items-center gap-2.5 px-5 py-3 transition-colors hover:bg-zinc-800/25"
                  >
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                    <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground/60">
                      {next.code}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                      {next.name}
                    </span>
                  </Link>
                ) : null}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
