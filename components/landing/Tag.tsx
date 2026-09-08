import type { ReactNode } from "react";

/** Bracketed tag: `[ Fyllbare PDF-er ]` */
export default function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted ${className}`}
    >
      <span className="text-brand-accent/70 mr-1.5">[</span>
      {children}
      <span className="text-brand-accent/70 ml-1.5">]</span>
    </span>
  );
}
