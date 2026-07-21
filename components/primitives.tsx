import { cn } from "@/lib/utils";
import type { PhaseStatus } from "@/lib/roadmap";

/**
 * Panel — the base container for every grouped block of data.
 * Subtle lift off the background plus a hairline border, so regions read as
 * distinct surfaces without heavy chrome.
 */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800/50 bg-zinc-900/40",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Panel title row, with optional right-aligned action/metric. */
export function PanelHeader({
  title,
  action,
  className,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-zinc-800/50 px-5 py-3.5",
        className
      )}
    >
      <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </h2>
      {action}
    </div>
  );
}

/** Small uppercase section heading for use outside panels. */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

/**
 * Progress bar — emerald fill on a neutral track.
 * Deliberately hairline-thin: it reads as data, not decoration.
 */
export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-zinc-800",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-progress transition-[width] duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** Status pill. Text-only; a dot marks the single active phase. */
export function StatusChip({ status }: { status: PhaseStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-progress">
        <span className="h-1 w-1 rounded-full bg-progress" />
        Active
      </span>
    );
  }
  return (
    <span className="text-[11px] font-medium text-muted-foreground/70">
      {status === "pending" ? "Pending" : "Locked"}
    </span>
  );
}

/** Label + monospaced value, used across stat blocks. */
export function Metric({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-lg font-medium tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
