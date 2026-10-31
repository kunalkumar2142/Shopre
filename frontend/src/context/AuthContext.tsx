import { getAuthErrorMessage, getCurrentUser, signIn, signUp } from "@/apis/apis";
import { getRoleFromToken, isTokenExpired } from "@/lib/auth-utils";
import type { SignInRequest, SignUpRequest } from "@/types/auth";
import type { UserProfile } from "@/types/user";
import type { Usersession } from "@/types/user-session";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthResult = { ok: true } | { ok: false; message: string };

interface AuthContextType {
  UserSession: Usersession | null;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (request: SignInRequest) => Promise<AuthResult>;
  register: (request: SignUpRequest) => Promise<AuthResult>;
  logout: () => void;
  refreshCurrentUser: () => Promise<UserProfile | null>;
}

const sanitizeUser = (user: UserProfile): UserProfile => {
  const safeUser = { ...user } as UserProfile & { password?: string };
  delete safeUser.password;
  return safeUser;
};

const isSessionValid = (session: Usersession | null): boolean => {
  if (!session?.token) return false;
  if (isTokenExpired(session.token)) return false;
  return true;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userSession, setUserSession] = useState<Usersession | null>(() => {
    try {
      const stored = localStorage.getItem("userSession");
      if (!stored) return null;
      const parsed = JSON.parse(stored) as Usersession;
      if (!parsed?.token || isTokenExpired(parsed.token)) {
        localStorage.removeItem("userSession");
        localStorage.removeItem("currentUser");
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? sanitizeUser(JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const persistSession = (token: string) => {
    const session = { token };
    localStorage.setItem("userSession", JSON.stringify(session));
    setUserSession(session);
  };

  const clearUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const clearSession = useCallback(() => {
    setUserSession(null);
    localStorage.removeItem("userSession");
    clearUser();
  }, []);

  const refreshCurrentUser = useCallback(async (): Promise<UserProfile | null> => {
    const raw = localStorage.getItem("userSession");
    if (!raw) {
      clearUser();
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as Usersession;
      if (!parsed?.token || isTokenExpired(parsed.token)) {
        clearSession();
        return null;
      }
    } catch {
      clearSession();
      return null;
    }
    try {
      const response = await getCurrentUser();
      const user = sanitizeUser(response.data);
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearUser();
      }
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    if (!userSession?.token) return;
    if (isTokenExpired(userSession.token)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      clearSession();
      return;
    }
    void refreshCurrentUser();
  }, [userSession?.token, refreshCurrentUser, clearSession]);

  const login = async (request: SignInRequest): Promise<AuthResult> => {
    try {
      const response = await signIn(request);
      persistSession(response.data.token);
      const user = await refreshCurrentUser();
      if (!user) {
        return {
          ok: false,
          message: "Signed in but could not load your profile. Please try again.",
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) };
    }
  };

  const register = async (request: SignUpRequest): Promise<AuthResult> => {
    try {
      const response = await signUp(request);
      persistSession(response.data.token);
      const user = await refreshCurrentUser();
      if (!user) {
        return {
          ok: false,
          message: "Account created but could not load your profile. Please try again.",
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) };
    }
  };

  const logout = () => {
    clearSession();
  };

  const value = {
    UserSession: userSession,
    currentUser,
    isAuthenticated: isSessionValid(userSession),
    isAdmin: currentUser
      ? currentUser.role === "ADMIN"
      : userSession && isSessionValid(userSession)
        ? getRoleFromToken(userSession.token) === "ADMIN"
        : false,
    login,
    register,
    logout,
    refreshCurrentUser,
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
