import { createContext, type ReactNode, useContext, useState } from "react";
import { deleteCookie, getCookie } from "../utils/cookies";

export type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDev = import.meta.env.DEV;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        const existing = getCookie("hub_session");
        if (!existing && isDev) {
            return "dev-mock-session";
        }
        return existing;
    });

    const isAuthenticated = token !== null;

    function logout() {
        deleteCookie("hub_session");
        setToken(null);
        window.location.href = "https://hub.ca/login";
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
