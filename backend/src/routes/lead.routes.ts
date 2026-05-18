import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLead,
  getLeads,
  updateLead
} from "../controllers/lead.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { protect } from "../middleware/auth";
import { requireRoles } from "../middleware/roles";
import { validate } from "../middleware/validate";
import { UserRole } from "../types";
import {
  createLeadSchema,
  leadQuerySchema,
  objectIdSchema,
  updateLeadSchema
} from "../validators/lead.validators";

export const leadRouter = Router();

leadRouter.use(protect);
leadRouter.get("/", validate({ query: leadQuerySchema }), asyncHandler(getLeads));
leadRouter.get("/export", requireRoles(UserRole.Admin), asyncHandler(exportLeadsCsv));
leadRouter.post("/", requireRoles(UserRole.Admin), validate({ body: createLeadSchema }), asyncHandler(createLead));
leadRouter.get("/:id", validate({ params: objectIdSchema }), asyncHandler(getLead));
leadRouter.patch("/:id", validate({ params: objectIdSchema, body: updateLeadSchema }), asyncHandler(updateLead));
leadRouter.delete("/:id", requireRoles(UserRole.Admin), validate({ params: objectIdSchema }), asyncHandler(deleteLead));
