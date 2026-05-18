import { Search } from "lucide-react";
import { LeadFilters as LeadFiltersType, LeadSource, LeadStatus } from "../../types";
import { Select } from "../ui/Select";

interface Props {
  filters: LeadFiltersType;
  searchValue: string;
  onFilterChange(filters: Partial<LeadFiltersType>): void;
  onSearchChange(value: string): void;
}

export const LeadFilters = ({ filters, searchValue, onFilterChange, onSearchChange }: Props): JSX.Element => (
  <div className="grid animate-fade-up gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_180px_180px_160px]">
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Search</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name or email"
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-ink outline-none transition duration-200 hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:ring-blue-950"
        />
      </div>
    </label>
    <Select label="Status" value={filters.status ?? ""} onChange={(event) => onFilterChange({ status: event.target.value as LeadStatus | "" })}>
      <option value="">All statuses</option>
      {Object.values(LeadStatus).map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </Select>
    <Select label="Source" value={filters.source ?? ""} onChange={(event) => onFilterChange({ source: event.target.value as LeadSource | "" })}>
      <option value="">All sources</option>
      {Object.values(LeadSource).map((source) => (
        <option key={source} value={source}>
          {source}
        </option>
      ))}
    </Select>
    <Select label="Sort" value={filters.sort} onChange={(event) => onFilterChange({ sort: event.target.value as "latest" | "oldest" })}>
      <option value="latest">Latest first</option>
      <option value="oldest">Oldest first</option>
    </Select>
  </div>
);
