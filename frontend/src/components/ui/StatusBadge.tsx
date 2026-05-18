import { LeadStatus } from "../../types";

const statusStyles: Record<LeadStatus, string> = {
  [LeadStatus.New]: "bg-blue-50 text-blue-700 ring-blue-100",
  [LeadStatus.Contacted]: "bg-amber-50 text-amber-700 ring-amber-100",
  [LeadStatus.Qualified]: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  [LeadStatus.Lost]: "bg-rose-50 text-rose-700 ring-rose-100"
};

export const StatusBadge = ({ status }: { status: LeadStatus }): JSX.Element => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
    {status}
  </span>
);
