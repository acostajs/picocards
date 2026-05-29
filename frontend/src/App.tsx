import { locales } from "./App.locales";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useRouter } from "./components/Router";
import { useLanguage } from "./context/LanguageContext";
import "./index.css";
import { Homepage } from "./pages/Homepage/Homepage";

export function App() {
    const { path } = useRouter();
    const { language } = useLanguage();

    let t = locales.en;
    switch (language) {
        case "en":
            t = locales.en;
            break;
        case "fr":
            t = locales.fr;
            break;
        case "es":
            t = locales.es;
            break;
        default: {
            const _exhaustiveCheck: never = language;
            t = locales.en;
        }
    }

    if (path === "/" || path === "") {
        return <Homepage />;
    }

    if (path === "/dashboard") {
        return (
            <ProtectedRoute>
                <div className="layout-shell">
                    <header className="card-surface flex flex-col md:flex-row justify-between items-center gap-space-sm">
                        <span className="text-heading-lg">
                            {t.dashboardTitle}
                        </span>
                        <a href="/" className="btn-primary no-underline">
                            {t.backToHome}
                        </a>
                    </header>
                    <main className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-space-md">
                        <h1 className="text-heading-lg text-4xl">
                            {t.workspaceTitle}
                        </h1>
                        <p className="text-body text-lg">{t.workspaceDesc}</p>
                    </main>
                </div>
            </ProtectedRoute>
        );
    }

    // Default 404 Fallback
    return (
        <div className="layout-shell flex items-center justify-center min-h-screen">
            <div className="card-surface text-center flex flex-col gap-space-md p-space-lg max-w-md">
                <h1 className="text-heading-lg text-4xl">{t.notFoundTitle}</h1>
                <p className="text-body">{t.notFoundDesc}</p>
                <a href="/" className="btn-primary no-underline">
                    {t.goHome}
                </a>
            </div>
        </div>
    );
}

export default App;
