import { signIn } from "@/api/auth";
import type { SignInRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";
import { error } from "console";
import { LogIn, LogOut } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType{
    UserSession: Usersession | null;
    isAuthenticated: boolean;
    isAdmin: boolean;

    login: (SignInRequest: SignInRequest) => Promise<boolean>
    logout: () => void;
}

const getRoleFromToken = (token: string) => {
    try{
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.role || "user"
    }catch(error){
        return "user"
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children : ReactNode }) => {
    const [userSession, setUserSession] = useState<Usersession | null> (() => {
       const storedUser = localStorage.getItem("userSession");
       return storedUser ? JSON.parse(storedUser) : null; 
    });
    
    const login = async (SignInRequest : SignInRequest): Promise<boolean> => {
        try{
            const response = await signIn(SignInRequest);
            const {email,token,name} = response.data;
            localStorage.setItem(
                "userSession", 
                JSON.stringify({email,token,name})
            );
            return true;
        }catch(error){
            throw(error);
        }
    };

    const logout = async () => {

    };

    const value = = {
        userSession,
        isAuthenticated: !!userSession,
        isAdmin: userSession ? getRoleFromToken(userSession.token) === "ADMIN",
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const UseAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new error("useauth must ued in AuthProvider")
    }
    return context;
}