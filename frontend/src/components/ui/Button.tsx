import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-blue-700 focus:ring-blue-200",
  secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
};

export const Button = ({ variant = "primary", className = "", children, ...props }: ButtonProps): JSX.Element => (
  <button
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
