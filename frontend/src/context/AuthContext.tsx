import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { authApi, LoginInput, RegisterInput } from "../api/auth";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): User | null => {
  const stored = localStorage.getItem("gigflow_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem("gigflow_user");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gigflow_token"));
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    const verifySession = async (): Promise<void> => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
        localStorage.setItem("gigflow_user", JSON.stringify(currentUser));
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void verifySession();
  }, [token]);

  const persistSession = (nextUser: User, nextToken: string): void => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("gigflow_user", JSON.stringify(nextUser));
    localStorage.setItem("gigflow_token", nextToken);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login: async (input) => {
        const result = await authApi.login(input);
        persistSession(result.user, result.token);
      },
      register: async (input) => {
        const result = await authApi.register(input);
        persistSession(result.user, result.token);
      },
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("gigflow_user");
        localStorage.removeItem("gigflow_token");
      }
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
