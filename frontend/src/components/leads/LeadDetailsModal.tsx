import { X } from "lucide-react";
import { Lead } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";

export const LeadDetailsModal = ({ lead, onClose }: { lead: Lead | null; onClose(): void }): JSX.Element | null => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md animate-scale-in rounded-lg bg-white shadow-soft dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-lg font-bold text-ink dark:text-white">Lead details</h2>
          <button className="rounded-lg p-2 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="text-sm text-slate-500">Name</div>
            <div className="font-semibold text-ink dark:text-white">{lead.name}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Email</div>
            <div className="font-semibold text-ink dark:text-white">{lead.email}</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Status</div>
              <StatusBadge status={lead.status} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Source</div>
              <div className="font-semibold text-ink dark:text-white">{lead.source}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Created At</div>
            <div className="font-semibold text-ink dark:text-white">{new Date(lead.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
