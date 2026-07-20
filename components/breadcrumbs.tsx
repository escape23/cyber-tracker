import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: Route;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 font-mono text-xs text-slate-500"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Dashboard
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-700" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-emerald-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-slate-300")}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
