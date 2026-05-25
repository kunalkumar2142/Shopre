import { getAuthErrorMessage, signIn, signUp } from "@/apis/auth";
import type { SignInRequest, SignUpRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";
import { createContext, useContext, useState, type ReactNode } from "react";

type AuthResult = { ok: true } | { ok: false; message: string };

interface AuthContextType {
  UserSession: Usersession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (request: SignInRequest) => Promise<AuthResult>;
  register: (request: SignUpRequest) => Promise<AuthResult>;
  logout: () => void;
}

const getRoleFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "user";
  } catch {
    return "user";
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<Usersession | null>(() => {
    const storedUser = localStorage.getItem("userSession");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistSession = (token: string) => {
    const session = { token };
    localStorage.setItem("userSession", JSON.stringify(session));
    setUserSession(session);
  };

  const login = async (request: SignInRequest): Promise<AuthResult> => {
    try {
      const response = await signIn(request);
      persistSession(response.data.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) };
    }
  };

  const register = async (request: SignUpRequest): Promise<AuthResult> => {
    try {
      const response = await signUp(request);
      persistSession(response.data.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) };
    }
  };

  const logout = () => {
    setUserSession(null);
    localStorage.removeItem("userSession");
  };

  const value = {
    UserSession: userSession,
    isAuthenticated: !!userSession,
    isAdmin: userSession ? getRoleFromToken(userSession.token) === "ADMIN" : false,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
