import { z } from "zod";
import { LeadSource, LeadStatus } from "../types";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource)
});

export const statusOnlySchema = z.object({
  status: z.nativeEnum(LeadStatus)
});

export type LeadFormValues = z.infer<typeof leadSchema>;
export type StatusOnlyValues = z.infer<typeof statusOnlySchema>;
