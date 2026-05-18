import { SearchX } from "lucide-react";

export const EmptyState = ({ title, message }: { title: string; message: string }): JSX.Element => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
    <SearchX className="mb-3 h-10 w-10 text-slate-400" aria-hidden="true" />
    <h3 className="text-base font-semibold text-ink dark:text-white">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
  </div>
);
