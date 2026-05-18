import { AxiosError } from "axios";
import { Download, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { leadsApi } from "../api/leads";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { LeadDetailsModal } from "../components/leads/LeadDetailsModal";
import { LeadFilters } from "../components/leads/LeadFilters";
import { LeadFormModal } from "../components/leads/LeadFormModal";
import { LeadTable } from "../components/leads/LeadTable";
import { Pagination } from "../components/leads/Pagination";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { LeadFormValues } from "../schemas/leadSchema";
import { Lead, LeadFilters as LeadFiltersType, LeadStatus, PaginationMeta, UserRole } from "../types";

const initialFilters: LeadFiltersType = {
  status: "",
  source: "",
  search: "",
  sort: "latest",
  page: 1
};

const initialMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false
};

export const DashboardPage = (): JSX.Element => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeadFiltersType>(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  const effectiveFilters = useMemo(() => ({ ...filters, search: debouncedSearch, page: filters.page }), [debouncedSearch, filters]);

  const loadLeads = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const result = await leadsApi.list(effectiveFilters);
      setLeads(result.leads);
      setMeta(result.meta);
    } catch (caught) {
      const axiosError = caught as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data.message ?? "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [effectiveFilters]);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const handleFilterChange = (next: Partial<LeadFiltersType>): void => {
    setFilters((current) => ({ ...current, ...next, page: 1 }));
  };

  const handleSubmitLead = async (values: LeadFormValues): Promise<void> => {
    setSaving(true);
    try {
      if (selectedLead) {
        await leadsApi.update(selectedLead._id, values);
      } else {
        await leadsApi.create(values);
      }
      setFormOpen(false);
      setSelectedLead(null);
      await loadLeads();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lead: Lead): Promise<void> => {
    const confirmed = window.confirm(`Delete ${lead.name}?`);
    if (!confirmed) return;
    await leadsApi.remove(lead._id);
    await loadLeads();
  };

  const handleStatusChange = async (lead: Lead, status: LeadStatus): Promise<void> => {
    await leadsApi.update(lead._id, { status });
    setLeads((current) => current.map((item) => (item._id === lead._id ? { ...item, status } : item)));
  };

  const handleExport = async (): Promise<void> => {
    const blob = await leadsApi.exportCsv();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gigflow-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAdmin = user?.role === UserRole.Admin;

  return (
    <DashboardLayout>
      <div className="mb-6 flex animate-fade-up flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-ink dark:text-white">Lead pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">Filter, search, and manage every inbound opportunity.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <>
              <Button variant="secondary" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={() => { setSelectedLead(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4" />
                New Lead
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <LeadFilters filters={filters} searchValue={searchInput} onSearchChange={setSearchInput} onFilterChange={handleFilterChange} />

        {error ? <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

        {loading ? (
          <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading leads...</div>
        ) : leads.length === 0 ? (
          <EmptyState title="No leads found" message="Adjust the filters or create a new lead to start filling the pipeline." />
        ) : (
          <>
            <LeadTable
              leads={leads}
              role={user?.role ?? UserRole.Sales}
              onView={setDetailsLead}
              onEdit={(lead) => { setSelectedLead(lead); setFormOpen(true); }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
            <Pagination meta={meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
          </>
        )}
      </div>

      <LeadFormModal
        lead={selectedLead}
        isOpen={formOpen}
        isSubmitting={saving}
        onClose={() => { setFormOpen(false); setSelectedLead(null); }}
        onSubmit={handleSubmitLead}
      />
      <LeadDetailsModal lead={detailsLead} onClose={() => setDetailsLead(null)} />
    </DashboardLayout>
  );
};
