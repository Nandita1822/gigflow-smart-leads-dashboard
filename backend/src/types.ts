import { Request } from "express";
import { Types } from "mongoose";

export enum UserRole {
  Admin = "Admin",
  Sales = "Sales User"
}

export enum LeadStatus {
  New = "New",
  Contacted = "Contacted",
  Qualified = "Qualified",
  Lost = "Lost"
}

export enum LeadSource {
  Website = "Website",
  Instagram = "Instagram",
  Referral = "Referral"
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type MongoId = Types.ObjectId | string;
