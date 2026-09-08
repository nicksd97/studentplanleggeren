import type { ReactNode } from "react";

/** Numbered section label in the editorial style: `(01) — Laget for norske studenter` */
export default function Eyebrow({
  n,
  children,
  className = "",
}: {
  n: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.25em] text-brand-accent ${className}`}
    >
      <span className="text-ink-muted">({n})</span>
      <span className="mx-2 text-ink-muted">—</span>
      {children}
    </p>
  );
}
