import { getAuthErrorMessage, getCurrentUser, signIn, signUp } from "@/apis/apis";
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

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
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

  const refreshCurrentUser = useCallback(async (): Promise<UserProfile | null> => {
    if (!localStorage.getItem("userSession")) {
      clearUser();
      return null;
    }
    try {
      const response = await getCurrentUser();
      setCurrentUser(response.data);
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearUser();
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (userSession?.token) {
      refreshCurrentUser();
    }
  }, [userSession?.token, refreshCurrentUser]);

  const login = async (request: SignInRequest): Promise<AuthResult> => {
    try {
      const response = await signIn(request);
      persistSession(response.data.token);
      const user = await refreshCurrentUser();
      if (!user) {
        return {
          ok: false,
          message: "Signed in but could not load your profile. Is the API gateway running on port 8081?",
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
          message: "Account created but could not load your profile. Is the API gateway running on port 8081?",
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getAuthErrorMessage(error) };
    }
  };

  const logout = () => {
    setUserSession(null);
    localStorage.removeItem("userSession");
    clearUser();
  };

  const value = {
    UserSession: userSession,
    currentUser,
    isAuthenticated: !!userSession,
    isAdmin: currentUser
      ? currentUser.role === "ADMIN"
      : userSession
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
