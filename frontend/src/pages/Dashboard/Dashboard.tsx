import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { type Language, useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { locales } from "./Dashboard.locales";

type Project = {
    id: string;
    title: string;
    description: string;
    owner_id: string;
    created_at: string;
};

const initialProjects: Project[] = [
    {
        id: "proj-1",
        title: "Chemistry 101",
        description:
            "Inorganic Chemistry study deck covering atomic orbitals, bonding, and kinetics for upcoming midterms.",
        owner_id: "student-1",
        created_at: new Date().toLocaleDateString(),
    },
    {
        id: "proj-2",
        title: "Calculus II",
        description:
            "Comprehensive review of integration techniques, series expansion, and differential equations.",
        owner_id: "student-1",
        created_at: new Date().toLocaleDateString(),
    },
];

export function Dashboard() {
    const { logout } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();

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

    // States
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [errorTitle, setErrorTitle] = useState<string | null>(null);

    // Simulate loading on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Form inputs change validation
    function handleTitleChange(val: string) {
        setFormTitle(val);
        if (val.trim() === "") {
            setErrorTitle(t.errTitleRequired);
        } else if (val.length > 100) {
            setErrorTitle(t.errTitleTooLong);
        } else {
            setErrorTitle(null);
        }
    }

    // Form Submit
    function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmedTitle = formTitle.trim();

        if (trimmedTitle === "") {
            setErrorTitle(t.errTitleRequired);
            return;
        }

        if (trimmedTitle.length > 100) {
            setErrorTitle(t.errTitleTooLong);
            return;
        }

        const newProject: Project = {
            id: `proj-${Date.now()}`,
            title: trimmedTitle,
            description: formDesc.trim(),
            owner_id: "student-1",
            created_at: new Date().toLocaleDateString(),
        };

        setProjects((prev) => [newProject, ...prev]);
        closeModal();
    }

    function closeModal() {
        setIsModalOpen(false);
        setFormTitle("");
        setFormDesc("");
        setErrorTitle(null);
    }

    function handleDeleteProject(id: string) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <div className="layout-shell">
            {/* Header / Navigation Bar */}
            <header className="card-surface flex flex-col lg:flex-row justify-between items-center gap-space-sm">
                <span className="text-heading-lg">{t.title}</span>
                <div className="flex flex-col sm:flex-row items-center gap-space-md">
                    {/* Navigation Link back to Hub */}
                    <a
                        href="https://hub.ca"
                        className="text-body font-bold hover:underline"
                    >
                        {t.navBack}
                    </a>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-space-sm">
                        <span className="text-body font-bold">
                            {t.langSelect}
                        </span>
                        <div className="flex gap-space-sm">
                            {(["en", "fr", "es"] as Language[]).map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setLanguage(lang)}
                                    className={`btn-primary ${
                                        language === lang
                                            ? "ring-2 ring-offset-2 ring-[var(--text-primary)]"
                                            : "opacity-60"
                                    }`}
                                >
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Toggle Button */}
                    <div className="flex items-center gap-space-sm">
                        <span className="text-body font-bold">
                            {t.themeToggle}
                        </span>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="btn-primary"
                        >
                            {theme === "dark" ? t.themeLight : t.themeDark}
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={logout}
                        className="btn-primary bg-transparent text-[var(--text-primary)]"
                    >
                        {t.logoutBtn}
                    </button>
                </div>
            </header>

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
                            <section
                                key={proj.id}
                                className="card-surface flex flex-col justify-between gap-space-md hover:scale-[1.01] hover:shadow-md cursor-pointer"
                            >
                                <div className="flex flex-col gap-space-sm">
                                    <div className="flex justify-between items-start gap-space-sm">
                                        <h2 className="text-heading-md text-xl font-bold uppercase tracking-tight">
                                            {proj.title}
                                        </h2>
                                        {/* Delete Button to trigger empty state testing */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(proj.id);
                                            }}
                                            className="text-sm font-black text-red-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all p-1"
                                            title="Delete Deck"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-body text-sm line-clamp-3">
                                        {proj.description || "—"}
                                    </p>
                                </div>
                                <div className="text-xs opacity-60 font-mono mt-auto flex justify-between">
                                    <span>ID: {proj.id}</span>
                                    <span>{proj.created_at}</span>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Project Interactive Dialog Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 dark:bg-white/20 backdrop-blur-xs flex items-center justify-center p-space-md z-50">
                    <div className="card-surface max-w-lg w-full bg-[var(--bg-primary)] p-space-lg flex flex-col gap-space-md shadow-2xl relative animate-scaleUp">
                        <h2 className="text-heading-md text-2xl uppercase tracking-tight font-black">
                            {t.modalTitle}
                        </h2>
                        <form
                            onSubmit={handleFormSubmit}
                            className="flex flex-col gap-space-md"
                        >
                            <div className="flex flex-col gap-space-sm">
                                <label
                                    htmlFor="proj-title"
                                    className="text-body font-bold"
                                >
                                    {t.fieldTitle} *
                                </label>
                                <input
                                    id="proj-title"
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) =>
                                        handleTitleChange(e.target.value)
                                    }
                                    placeholder={t.placeholderTitle}
                                    className="card-surface p-2 w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                                    required
                                />
                                {errorTitle && (
                                    <span className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        {errorTitle}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-space-sm">
                                <label
                                    htmlFor="proj-desc"
                                    className="text-body font-bold"
                                >
                                    {t.fieldDesc}
                                </label>
                                <textarea
                                    id="proj-desc"
                                    value={formDesc}
                                    onChange={(e) =>
                                        setFormDesc(e.target.value)
                                    }
                                    placeholder={t.placeholderDesc}
                                    rows={4}
                                    className="card-surface p-2 w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                                />
                            </div>

                            <div className="flex justify-end gap-space-sm mt-space-sm">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-primary bg-transparent text-[var(--text-primary)]"
                                >
                                    {t.cancelBtn}
                                </button>
                                <button type="submit" className="btn-primary">
                                    {t.saveBtn}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
