"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance from "@/lib/axios";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

type RegisterResponse = {
  success: boolean;
  message: string;
  data: User;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((nextUser: User, nextToken: string) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await axiosInstance.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      setAuth(data.data.user, data.data.accessToken);
    },
    [setAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await axiosInstance.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
      });
    },
    []
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    axiosInstance
      .get<{ success: boolean; data: User }>("/users/me")
      .then(({ data }) => {
        if (data.success) {
          setUser(data.data);
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      setAuth,
    }),
    [user, token, isLoading, login, register, logout, setAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
