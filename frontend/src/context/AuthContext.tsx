import { signIn } from "@/api/auth";
import type { SignInRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";
import { LogIn } from "lucide-react";
import { createContext, useState, type ReactNode } from "react";

interface AuthContextType{
    UserSession: Usersession | null;
    isAuthenticated: boolean;
    isAdmin: boolean;

    login: (SignInRequest: SignInRequest) => Promise<boolean>
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children : ReactNode }) => {
    const [userSession, setUserSession] = useState<Usersession | null> (() => {
       const storedUser = localStorage.getItem("userSession");
       return storedUser ? JSON.parse(storedUser) : null; 
    });
    const login = async (SignInRequest : SignInRequest): Promise<boolean> => {
        const response = await signIn(SignInRequest);
        const {email,token,name} = response.data;
        localStorage.setItem("userSession", JSON.stringify({email,token,name}));
        return true;
    };

    const logout = async () => {

    };
}