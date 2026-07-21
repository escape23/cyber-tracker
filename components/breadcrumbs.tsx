import Link from "next/link";
import type { Route } from "next";

export interface Crumb {
  label: string;
  href?: Route;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Roadmap
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            <span className="text-muted-foreground/30">/</span>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
