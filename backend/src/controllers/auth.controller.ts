import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response } from "express";
import { env } from "../config/env";
import { User, UserDocument } from "../models/User";
import { AuthRequest, UserRole } from "../types";
import { AppError } from "../utils/AppError";
import { sendResponse } from "../utils/apiResponse";

const signToken = (userId: string, role: UserRole): string => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign({ userId, role }, env.jwtSecret, options);
};

const publicUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new AppError("Email is already registered", 409);

  const isFirstUser = (await User.countDocuments()) === 0;
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: isFirstUser ? UserRole.Admin : req.body.role ?? UserRole.Sales
  });

  const token = signToken(user.id, user.role);
  sendResponse(res, 201, "Registration successful", { user: publicUser(user), token });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user.id, user.role);
  sendResponse(res, 200, "Login successful", { user: publicUser(user), token });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  sendResponse(res, 200, "Authenticated user", { user: req.user });
};
