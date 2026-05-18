import { api } from "./client";
import { ApiResponse, User, UserRole } from "../types";

interface AuthPayload {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: async (input: RegisterInput): Promise<AuthPayload> => {
    const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/register", input);
    return data.data;
  },
  login: async (input: LoginInput): Promise<AuthPayload> => {
    const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/login", input);
    return data.data;
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<{ user: User }>>("/auth/me");
    return data.data.user;
  }
};
