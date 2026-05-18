import { Response } from "express";
import { PaginationMeta } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: PaginationMeta
): void => {
  const payload: ApiResponse<T> = { success: statusCode < 400, message };
  if (data !== undefined) payload.data = data;
  if (meta) payload.meta = meta;
  res.status(statusCode).json(payload);
};
