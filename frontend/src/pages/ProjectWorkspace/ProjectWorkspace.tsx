import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NavigationHeader } from "../../components/NavigationHeader";
import { useTranslation } from "../../hooks/useTranslation";
import { api } from "../../utils/api";
import { CollaboratorsPanel } from "./components/CollaboratorsPanel";
import { CreateCardModal } from "./components/CreateCardModal";
import { EditModeView } from "./components/EditModeView";
import { StudyModeView } from "./components/StudyModeView";
import { useCardDeck } from "./hooks/useCardDeck";
import { useCollaborators } from "./hooks/useCollaborators";
import { locales } from "./ProjectWorkspace.locales";

export function ProjectWorkspace() {
    const { projectId } = useParams<{ projectId: string }>();
    const t = useTranslation(locales);

    // Encapsulated Custom hooks for Card Deck and Collaborators state
    const {
        projectCards,
        studyIndex,
        isFlipped,
        setIsFlipped,
        handleCreateCard,
        handleDeleteCard,
        handlePrev,
        handleNext,
        handleShuffle,
    } = useCardDeck(projectId);

    const {
        projectCollaborators,
        handleInviteCollaborator,
        handleRemoveCollaborator,
    } = useCollaborators(projectId);

    // States
    const [project, setProject] = useState<{ title: string } | null>(() => {
        const stored = localStorage.getItem("picocards_projects");
        if (stored && projectId) {
            try {
                const parsed = JSON.parse(stored) as {
                    id: string;
                    title: string;
                }[];
                return parsed.find((p) => p.id === projectId) || null;
            } catch {}
        }
        return null;
    });
    const [viewMode, setViewMode] = useState<
        "study" | "edit" | "collaborators"
    >("study");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch fresh project details on mount
    useEffect(() => {
        if (projectId) {
            api.get<{ title: string }>(`/api/projects/${projectId}`)
                .then((data) => {
                    setProject(data);
                })
                .catch((err) => {
                    console.error("Failed to fetch project details:", err);
                });
        }
    }, [projectId]);

    const projectTitle = project ? project.title : t.headline;

    return (
        <div className="layout-shell">
            {/* Navigation Header */}
            <NavigationHeader>
                <Link
                    to="/dashboard"
                    className="text-body font-bold hover:underline"
                >
                    {t.navBack}
                </Link>
            </NavigationHeader>

            {/* Page Main Content Workspace */}
            <main className="flex-1 flex flex-col gap-space-md py-space-md">
                {/* Title and Segmented Switcher */}
                <div className="flex flex-col md:flex-row justify-between items-center border-[var(--border-primary)] border-b-2 pb-space-sm gap-space-sm">
                    <h1 className="text-heading-lg text-3xl font-black uppercase tracking-tight">
                        {projectTitle}
                    </h1>

                    {/* Mode Segmented Controller Toggle */}
                    <div className="flex border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-space-xs">
                        {(["study", "edit", "collaborators"] as const).map(
                            (mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => {
                                        setViewMode(mode);
                                        setIsFlipped(false);
                                    }}
                                    className={`px-space-md py-space-sm font-bold transition-all text-sm cursor-pointer ${
                                        viewMode === mode
                                            ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                            : "bg-transparent text-[var(--text-primary)] opacity-70"
                                    }`}
                                >
                                    {mode === "study"
                                        ? t.studyMode
                                        : mode === "edit"
                                          ? t.editMode
                                          : t.collaboratorsMode}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                {/* Main Views Router */}
                {viewMode === "study" && (
                    <StudyModeView
                        projectCards={projectCards}
                        studyIndex={studyIndex}
                        isFlipped={isFlipped}
                        onFlip={() => setIsFlipped((prev) => !prev)}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onShuffle={handleShuffle}
                        t={t}
                        onSwitchToEdit={() => setViewMode("edit")}
                    />
                )}

                {viewMode === "edit" && (
                    <EditModeView
                        projectCards={projectCards}
                        onDeleteCard={(id) => {
                            if (window.confirm(t.confirmDeleteCard)) {
                                handleDeleteCard(id);
                            }
                        }}
                        onCreateCardClick={() => setIsModalOpen(true)}
                        t={t}
                    />
                )}

                {viewMode === "collaborators" && (
                    <CollaboratorsPanel
                        collaborators={projectCollaborators}
                        onInvite={handleInviteCollaborator}
                        onRemove={handleRemoveCollaborator}
                        t={t}
                    />
                )}
            </main>

            {/* Create Card Dialog Slide-Over Overlay Modal */}
            <CreateCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCard}
                t={t}
            />
        </div>
    );
}
