import { createContext, type ReactNode, useContext, useState } from "react";

export type AuthContextType = {
    isAuthenticated: boolean;
    token: string | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null;
    }
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
        const parts = cookie.split("=");
        const key = parts[0];
        const value = parts[1];
        if (key === name && value !== undefined) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") {
        return;
    }
    // Delete for root subdomain
    // biome-ignore lint/suspicious/noDocumentCookie: Purge root-domain SSO cookie on logout.
    document.cookie = `${name}=; path=/; domain=.hub.ca; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    // Delete for local current domain
    // biome-ignore lint/suspicious/noDocumentCookie: Purge local domain SSO cookie on logout.
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

const isDev =
    (typeof process !== "undefined" &&
        process.env?.NODE_ENV === "development") ||
    (typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1"));

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
