import {
    createContext,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type RouterContextType = {
    path: string;
    navigate: (to: string) => void;
};

const RouterContext = createContext<RouterContextType | undefined>(undefined);

type RouterProps = {
    children: ReactNode;
};

export function Router({ children }: RouterProps) {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname);
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    function navigate(to: string) {
        window.history.pushState({}, "", to);
        setPath(to);
    }

    return (
        <RouterContext.Provider value={{ path, navigate }}>
            {children}
        </RouterContext.Provider>
    );
}

export function useRouter() {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error("useRouter must be used within a Router");
    }
    return context;
}

type LinkProps = {
    to: string;
    children: ReactNode;
    className?: string;
};

export function Link({ to, children, className }: LinkProps) {
    const { navigate } = useRouter();

    function handleClick(e: ReactMouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        navigate(to);
    }

    return (
        <a href={to} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
