import { Eye, Pencil, Trash2 } from "lucide-react";
import { Lead, LeadStatus, UserRole } from "../../types";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";

interface Props {
  leads: Lead[];
  role: UserRole;
  onView(lead: Lead): void;
  onEdit(lead: Lead): void;
  onDelete(lead: Lead): void;
  onStatusChange(lead: Lead, status: LeadStatus): void;
}

export const LeadTable = ({ leads, role, onView, onEdit, onDelete, onStatusChange }: Props): JSX.Element => (
  <div className="animate-fade-up overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {["Lead", "Status", "Source", "Created", "Actions"].map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="transition duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/70">
              <td className="px-4 py-4">
                <div className="font-semibold text-ink dark:text-white">{lead.name}</div>
                <div className="text-sm text-slate-500">{lead.email}</div>
              </td>
              <td className="px-4 py-4">
                {role === UserRole.Sales ? (
                  <select
                    value={lead.status}
                    onChange={(event) => onStatusChange(lead, event.target.value as LeadStatus)}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {Object.values(LeadStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={lead.status} />
                )}
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.source}</td>
              <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" className="px-2" onClick={() => onView(lead)} aria-label={`View ${lead.name}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" className="px-2" onClick={() => onEdit(lead)} aria-label={`Edit ${lead.name}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {role === UserRole.Admin ? (
                    <Button variant="danger" className="px-2" onClick={() => onDelete(lead)} aria-label={`Delete ${lead.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
