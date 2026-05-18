import { FilterQuery } from "mongoose";
import { Response } from "express";
import { Lead, ILead } from "../models/Lead";
import { AuthRequest, LeadStatus, UserRole } from "../types";
import { AppError } from "../utils/AppError";
import { sendResponse } from "../utils/apiResponse";

interface LeadListQuery {
  status?: LeadStatus;
  source?: string;
  search?: string;
  sort: "latest" | "oldest";
  page: number;
  limit: number;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const lead = await Lead.create({ ...req.body, createdBy: req.user.id });
  sendResponse(res, 201, "Lead created", { lead });
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search, sort, page, limit } = req.query as unknown as LeadListQuery;
  const filter: FilterQuery<ILead> = {};

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: sort === "oldest" ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(filter)
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  sendResponse(res, 200, "Leads retrieved", { leads }, {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  });
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate("createdBy", "name email");
  if (!lead) throw new AppError("Lead not found", 404);
  sendResponse(res, 200, "Lead retrieved", { lead });
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError("Authentication required", 401);

  const allowedUpdate = req.user.role === UserRole.Sales ? { status: req.body.status } : req.body;
  if (req.user.role === UserRole.Sales && Object.keys(req.body).some((key) => key !== "status")) {
    throw new AppError("Sales users can update status only", 403);
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, allowedUpdate, {
    new: true,
    runValidators: true
  });
  if (!lead) throw new AppError("Lead not found", 404);
  sendResponse(res, 200, "Lead updated", { lead });
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError("Lead not found", 404);
  sendResponse(res, 200, "Lead deleted", { lead });
};

export const exportLeadsCsv = async (req: AuthRequest, res: Response): Promise<void> => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  const header = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.createdAt.toISOString()
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  res.header("Content-Type", "text/csv");
  res.attachment(`gigflow-leads-${new Date().toISOString().slice(0, 10)}.csv`);
  res.status(200).send(csv);
};
