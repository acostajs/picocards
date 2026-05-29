import { Link, Route, Routes } from "react-router-dom";
import { locales } from "./App.locales";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useTranslation } from "./hooks/useTranslation";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Homepage } from "./pages/Homepage/Homepage";
import { ProjectWorkspace } from "./pages/ProjectWorkspace/ProjectWorkspace";
import "./index.css";

export function App() {
    const t = useTranslation(locales);

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
