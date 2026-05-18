import { z } from "zod";
import { LeadSource, LeadStatus } from "../types";

export const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id")
});

export const createLeadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource)
});

export const updateLeadSchema = createLeadSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required"
});

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus)
});

export const leadQuerySchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  search: z.string().max(120).optional(),
  sort: z.enum(["latest", "oldest"]).default("latest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});
