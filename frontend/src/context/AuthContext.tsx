import type { SignInRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";
import { createContext } from "react";

interface AuthContextType{
    UserSession: Usersession | null;
    isAuthenticated: boolean;
    isAdmin: boolean;

    login: (SignInRequest: SignInRequest) => Promise<boolean>
    logout: () => void;
}

const [authContext , setAuthContext]

const AuthContext = createContext<AuthContextType | undefined>(undefined);