import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LoginValues, RegisterValues, loginSchema, registerSchema } from "../schemas/authSchema";
import { UserRole } from "../types";

interface Props {
  mode: "login" | "register";
}

export const AuthPage = ({ mode }: Props): JSX.Element => {
  const isRegister = mode === "register";
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? { name: "", email: "", password: "", role: UserRole.Sales }
      : { email: "", password: "" }
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (values: LoginValues | RegisterValues): Promise<void> => {
    setServerError("");
    try {
      if (isRegister) {
        await registerUser(values as RegisterValues);
      } else {
        await login(values as LoginValues);
      }
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setServerError(
        axiosError.response?.data.message ??
          (axiosError.request ? "Cannot connect to the API server. Make sure the backend is running on port 5000." : "Something went wrong")
      );
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-[0.95fr_1.05fr]">
      <button
        className="fixed right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <section className="flex items-center justify-center bg-ink px-6 py-12 text-white dark:bg-slate-950">
        <div className="max-w-lg animate-fade-up">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-200">GigFlow CRM</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Smart Leads Dashboard</h1>
          <p className="mt-5 text-base leading-7 text-slate-200">
            A focused workspace for teams that need clean lead tracking, fast qualification, and role-aware operations.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-scale-in rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(21,32,43,0.12)] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink dark:text-white">{isRegister ? "Create account" : "Welcome back"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister ? "The first registered user becomes an admin." : "Sign in to manage your leads."}
            </p>
          </div>
          {serverError ? <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div> : null}
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {isRegister ? (
              <Input label="Name" error={(form.formState.errors as Partial<Record<keyof RegisterValues, { message?: string }>>).name?.message} {...form.register("name" as const)} />
            ) : null}
            <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register("email")} />
            <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register("password")} />
            {isRegister ? (
              <Select label="Role" {...form.register("role" as const)}>
                <option value={UserRole.Sales}>Sales User</option>
                <option value={UserRole.Admin}>Admin</option>
              </Select>
            ) : null}
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="font-semibold text-brand" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Register"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};
