import { cn } from "@/lib/utils";
import type { PhaseStatus } from "@/lib/roadmap";

/** Small uppercase section heading. Structure without visual weight. */
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
        "h-1 w-full overflow-hidden rounded-full bg-border/60",
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
