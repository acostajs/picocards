import { Link, Route, Routes } from "react-router-dom";
import { locales } from "./App.locales";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useLanguage } from "./context/LanguageContext";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Homepage } from "./pages/Homepage/Homepage";
import { ProjectWorkspace } from "./pages/ProjectWorkspace/ProjectWorkspace";
import "./index.css";

export function App() {
    const { language } = useLanguage();

    // Exhaustive localization lookup
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

    return (
        <Routes>
            {/* Landing Homepage */}
            <Route path="/" element={<Homepage />} />

            {/* Protected Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected Single Project Workspace */}
            <Route
                path="/projects/:projectId"
                element={
                    <ProtectedRoute>
                        <ProjectWorkspace />
                    </ProtectedRoute>
                }
            />

            {/* Fallback 404 Page */}
            <Route
                path="*"
                element={
                    <div className="layout-shell flex items-center justify-center min-h-screen">
                        <div className="card-surface text-center flex flex-col gap-space-md p-space-lg max-w-md">
                            <h1 className="text-heading-lg text-4xl">
                                {t.notFoundTitle}
                            </h1>
                            <p className="text-body">{t.notFoundDesc}</p>
                            <Link to="/" className="btn-primary no-underline">
                                {t.goHome}
                            </Link>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}

export default App;
