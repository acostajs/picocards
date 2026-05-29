import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NavigationHeader } from "../../components/NavigationHeader";
import { useTranslation } from "../../hooks/useTranslation";
import { CollaboratorsPanel } from "./components/CollaboratorsPanel";
import { CreateCardModal } from "./components/CreateCardModal";
import { EditModeView } from "./components/EditModeView";
import { StudyModeView } from "./components/StudyModeView";
import { useCardDeck } from "./hooks/useCardDeck";
import { useCollaborators } from "./hooks/useCollaborators";
import { locales } from "./ProjectWorkspace.locales";
import type { Card, Collaborator } from "./types";

// STUB: Replace with API fetch in Phase 2
const initialCards: Card[] = [
    {
        id: "card-1",
        project_id: "proj-1",
        question: "What is the Schrodinger wave equation?",
        answer: "An equation that describes how the quantum state of a physical system changes with time, formulated as Hψ = Eψ.",
    },
    {
        id: "card-2",
        project_id: "proj-1",
        question: "What is the difference between Sn1 and Sn2 reactions?",
        answer: "Sn1 is a unimolecular nucleophilic substitution with a carbocation intermediate, while Sn2 is bimolecular with a single-step transition state.",
    },
    {
        id: "card-3",
        project_id: "proj-2",
        question: "What is the formula for integration by parts?",
        answer: "∫ u dv = uv - ∫ v du",
    },
    {
        id: "card-4",
        project_id: "proj-2",
        question: "What is the derivative of sin(x)?",
        answer: "d/dx [sin(x)] = ...",
    },
];

// STUB: Replace with API fetch in Phase 2
const initialCollaborators: Collaborator[] = [
    {
        id: "collab-1",
        project_id: "proj-1",
        email: "marie.curie@hub.ca",
        role: "editor",
    },
    {
        id: "collab-2",
        project_id: "proj-1",
        email: "albert.einstein@hub.ca",
        role: "visitor",
    },
];

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
    } = useCardDeck(projectId, initialCards);

    const {
        projectCollaborators,
        handleInviteCollaborator,
        handleRemoveCollaborator,
    } = useCollaborators(projectId, initialCollaborators);

    // States
    const [viewMode, setViewMode] = useState<
        "study" | "edit" | "collaborators"
    >("study");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic Project Name parsing based on dynamic ID from localStorage projects cache
    const storedProjects = (() => {
        const stored = localStorage.getItem("picocards_projects");
        if (stored) {
            try {
                return JSON.parse(stored) as { id: string; title: string }[];
            } catch {}
        }
        return [
            { id: "proj-1", title: "Chemistry 101" },
            { id: "proj-2", title: "Calculus II" },
        ];
    })();

    const currentProject = storedProjects.find((p) => p.id === projectId);
    const projectTitle = currentProject ? currentProject.title : t.headline;

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
