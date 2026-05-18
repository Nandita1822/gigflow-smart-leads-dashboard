import { Router } from "express";
import { login, getMe, register } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post("/register", validate({ body: registerSchema }), asyncHandler(register));
authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(login));
authRouter.get("/me", protect, asyncHandler(getMe));
