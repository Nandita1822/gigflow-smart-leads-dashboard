import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = ({ label, error, children, className = "", ...props }: SelectProps): JSX.Element => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    <select
      className={`h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition duration-200 hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:ring-blue-950 ${className}`}
      {...props}
    >
      {children}
    </select>
    {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
  </label>
);
