import { api } from "./client";
import { ApiResponse, Lead, LeadFilters, PaginationMeta } from "../types";
import { LeadFormValues } from "../schemas/leadSchema";

export interface LeadListResult {
  leads: Lead[];
  meta: PaginationMeta;
}

export const leadsApi = {
  list: async (filters: LeadFilters): Promise<LeadListResult> => {
    const params = {
      ...filters,
      limit: 10,
      status: filters.status || undefined,
      source: filters.source || undefined,
      search: filters.search || undefined
    };
    const { data } = await api.get<ApiResponse<{ leads: Lead[] }>>("/api/leads", { params });
    return { leads: data.data.leads, meta: data.meta as PaginationMeta };
  },
  get: async (id: string): Promise<Lead> => {
    const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/api/leads/${id}`);
    return data.data.lead;
  },
  create: async (input: LeadFormValues): Promise<Lead> => {
    const { data } = await api.post<ApiResponse<{ lead: Lead }>>("/api/leads", input);
    return data.data.lead;
  },
  update: async (id: string, input: Partial<LeadFormValues>): Promise<Lead> => {
    const { data } = await api.patch<ApiResponse<{ lead: Lead }>>(`/api/leads/${id}`, input);
    return data.data.lead;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/api/leads/${id}`);
  },
  exportCsv: async (): Promise<Blob> => {
    const { data } = await api.get<Blob>("/api/leads/export", { responseType: "blob" });
    return data;
  }
};
