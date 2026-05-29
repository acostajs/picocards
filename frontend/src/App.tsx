import { useRouter } from "./components/Router";
import "./index.css";
import { Homepage } from "./pages/Homepage/Homepage";

export function App() {
    const { path } = useRouter();

    if (path === "/" || path === "") {
        return <Homepage />;
    }

    if (path === "/dashboard") {
        return (
            <div className="layout-shell">
                <header className="card-surface flex flex-col md:flex-row justify-between items-center gap-space-sm">
                    <span className="text-heading-lg">PicoCards Dashboard</span>
                    <a href="/" className="btn-primary no-underline">
                        Back to Home
                    </a>
                </header>
                <main className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-space-md">
                    <h1 className="text-heading-lg text-4xl">Your Workspace</h1>
                    <p className="text-body text-lg">
                        Welcome to your study dashboard. This workspace will
                        connect with Phase 1.3 features.
                    </p>
                </main>
            </div>
        );
    }

    // Default 404 Fallback
    return (
        <div className="layout-shell flex items-center justify-center min-h-screen">
            <div className="card-surface text-center flex flex-col gap-space-md p-space-lg max-w-md">
                <h1 className="text-heading-lg text-4xl">404</h1>
                <p className="text-body">Page Not Found</p>
                <a href="/" className="btn-primary no-underline">
                    Go Home
                </a>
            </div>
        </div>
    );
}

export default App;
