import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-accent text-brand-dark hover:bg-brand-accent/90 font-medium",
  secondary:
    "bg-brand-dark text-white hover:bg-brand-dark/90 font-medium",
  outline:
    "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white font-medium",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm transition-all duration-200 cursor-pointer font-[family-name:var(--font-body)]";

type ButtonProps = {
  variant?: Variant;
  className?: string;
  fullWidth?: boolean;
} & (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
);

export default function Button({
  variant = "primary",
  className = "",
  fullWidth = false,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
    return <a href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
