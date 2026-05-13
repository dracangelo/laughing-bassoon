import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-aceBlue text-[#081018]",
  secondary: "border border-slate-700 bg-[#0f151b] text-slate-200",
  danger: "border border-red-900 bg-red-950/70 text-red-100",
  ghost: "text-slate-300 hover:bg-slate-800/60"
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 font-black transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
