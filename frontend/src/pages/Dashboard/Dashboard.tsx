import { useEffect, useState } from "react";
import { NavigationHeader } from "../../components/NavigationHeader";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { api } from "../../utils/api";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { ProjectCard } from "./components/ProjectCard";
import { locales } from "./Dashboard.locales";
import type { Project } from "./types";

export function Dashboard() {
    const { logout } = useAuth();
    const t = useTranslation(locales);

    // States
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Persist projects locally for dynamic workspace lookup
    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem(
                "picocards_projects",
                JSON.stringify(projects),
            );
        }
    }, [projects]);

    // Fetch projects on mount
    useEffect(() => {
        api.get<Project[]>("/api/projects")
            .then((data) => {
                setProjects(data);
                localStorage.setItem(
                    "picocards_projects",
                    JSON.stringify(data),
                );
            })
            .catch((err) => {
                console.error("Failed to fetch projects:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    function handleCreateProject(title: string, description: string) {
        api.post<Project>("/api/projects", { title, description })
            .then((newProject) => {
                setProjects((prev) => [newProject, ...prev]);
                setIsModalOpen(false);
            })
            .catch((err) => {
                alert(err.message || "Failed to create project");
            });
    }

    function handleDeleteProject(id: string) {
        if (window.confirm(t.confirmDeleteProject)) {
            api.delete(`/api/projects/${id}`)
                .then(() => {
                    setProjects((prev) => prev.filter((p) => p.id !== id));
                })
                .catch((err) => {
                    alert(err.message || "Failed to delete project");
                });
        }
    }

    return (
        <div className="layout-shell">
            {/* Header / Navigation Bar */}
            <NavigationHeader>
                {/* Navigation Link back to Hub */}
                <a
                    href="https://hub.ca"
                    className="text-body font-bold hover:underline"
                >
                    {t.navBack}
                </a>

                {/* Logout Button */}
                <button
                    type="button"
                    onClick={logout}
                    className="btn-primary bg-transparent text-[var(--text-primary)]"
                >
                    {t.logoutBtn}
                </button>
            </NavigationHeader>

            {/* Dashboard Workspace */}
            <main className="flex-1 flex flex-col gap-space-md py-space-md">
                <div className="flex justify-between items-center border-[var(--border-primary)] border-b-2 pb-space-sm">
                    <h1 className="text-heading-lg text-3xl font-black uppercase tracking-tight">
                        {t.headline}
                    </h1>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        {t.createBtn}
                    </button>
                </div>

                {/* Simulated Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md w-full mt-space-sm">
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className="card-surface flex flex-col gap-space-sm h-48 animate-pulse opacity-40"
                            >
                                <div className="h-6 bg-[var(--text-primary)] w-2/3 rounded-none" />
                                <div className="h-4 bg-[var(--text-primary)] w-full rounded-none" />
                                <div className="h-4 bg-[var(--text-primary)] w-4/5 rounded-none" />
                                <div className="h-4 bg-[var(--text-primary)] w-1/3 rounded-none mt-auto" />
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    /* Empty State View */
                    <div className="card-surface border-dashed border-4 flex flex-col items-center justify-center p-space-lg text-center gap-space-md max-w-xl mx-auto my-space-lg min-h-64">
                        <h3 className="text-heading-md text-xl">
                            {t.emptyTitle}
                        </h3>
                        <p className="text-body text-base max-w-sm">
                            {t.emptyText}
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary mt-space-sm"
                        >
                            {t.createBtn}
                        </button>
                    </div>
                ) : (
                    /* Project Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md w-full mt-space-sm">
                        {projects.map((proj) => (
                            <ProjectCard
                                key={proj.id}
                                project={proj}
                                onDelete={handleDeleteProject}
                                t={t}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Project Interactive Dialog Modal */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
                t={t}
            />
        </div>
    );
}
