type Variant = "accent" | "dark" | "outline";

const variantClasses: Record<Variant, string> = {
  accent: "bg-brand-accent text-brand-dark",
  dark: "bg-brand-dark text-white",
  outline: "border border-brand-accent text-brand-accent",
};

export default function Badge({
  children,
  variant = "accent",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-[family-name:var(--font-body)] ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
