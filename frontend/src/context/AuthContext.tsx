import { signIn } from "@/apis/auth";
import type { SignInRequest } from "@/types/auth";
import type { Usersession } from "@/types/user-session";
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
            const session = {email, token, name}
            localStorage.setItem(
                "userSession", 
                JSON.stringify(session)
            );
            setUserSession(session);
            return true;
        }catch(error){
            return false;
        }
    };

    const logout = async () => {
        setUserSession(null);
        localStorage.removeItem("userSession");
    };

    const value = {
        UserSession : userSession,
        isAuthenticated: !!userSession,
        isAdmin: userSession ? getRoleFromToken(userSession.token) === "ADMIN" : false,
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useauth must ued in AuthProvider")
    }
    return context;
}