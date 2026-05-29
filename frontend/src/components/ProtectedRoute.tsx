import { type ReactNode, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = "https://hub.ca/login";
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
export default ProtectedRoute;
