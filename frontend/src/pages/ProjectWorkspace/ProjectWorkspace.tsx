import { type SyntheticEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Language, useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { locales } from "./ProjectWorkspace.locales";

type Card = {
    id: string;
    project_id: string;
    question: string;
    answer: string;
};

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
        answer: "d/dx [sin(x)] = cos(x)",
    },
];

export function ProjectWorkspace() {
    const { projectId } = useParams<{ projectId: string }>();
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

    // State managers
    const [cards, setCards] = useState<Card[]>(initialCards);
    const [viewMode, setViewMode] = useState<"study" | "edit">("study");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formQuestion, setFormQuestion] = useState("");
    const [formAnswer, setFormAnswer] = useState("");
    const [errorQuestion, setErrorQuestion] = useState<string | null>(null);
    const [errorAnswer, setErrorAnswer] = useState<string | null>(null);

    // Study Mode state
    const [studyIndex, setStudyIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const projectCards = cards.filter((c) => c.project_id === projectId);
    const activeCard = projectCards.at(studyIndex);

    // Reset index if deck changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: Reset active indices whenever the projectId routes change.
    useEffect(() => {
        setStudyIndex(0);
        setIsFlipped(false);
    }, [projectId]);

    // Validation change handlers
    function handleQuestionChange(val: string) {
        setFormQuestion(val);
        if (val.trim() === "") {
            setErrorQuestion(t.errQuestionRequired);
        } else {
            setErrorQuestion(null);
        }
    }

    function handleAnswerChange(val: string) {
        setFormAnswer(val);
        if (val.trim() === "") {
            setErrorAnswer(t.errAnswerRequired);
        } else {
            setErrorAnswer(null);
        }
    }

    // Submit Card Form
    function handleFormSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmedQ = formQuestion.trim();
        const trimmedA = formAnswer.trim();
        let hasError = false;

        if (trimmedQ === "") {
            setErrorQuestion(t.errQuestionRequired);
            hasError = true;
        }

        if (trimmedA === "") {
            setErrorAnswer(t.errAnswerRequired);
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const newCard: Card = {
            id: `card-${Date.now()}`,
            project_id: projectId || "proj-1",
            question: trimmedQ,
            answer: trimmedA,
        };

        setCards((prev) => [...prev, newCard]);
        closeModal();
    }

    function closeModal() {
        setIsModalOpen(false);
        setFormQuestion("");
        setFormAnswer("");
        setErrorQuestion(null);
        setErrorAnswer(null);
    }

    function handleDeleteCard(id: string) {
        setCards((prev) => prev.filter((c) => c.id !== id));
        // Reset study bounds in case active index is destroyed
        if (studyIndex >= projectCards.length - 1 && studyIndex > 0) {
            setStudyIndex((prev) => prev - 1);
        }
        setIsFlipped(false);
    }

    // Navigation sequentially
    function handlePrev() {
        if (projectCards.length === 0) return;
        setIsFlipped(false);
        setStudyIndex(
            (prev) => (prev - 1 + projectCards.length) % projectCards.length,
        );
    }

    function handleNext() {
        if (projectCards.length === 0) return;
        setIsFlipped(false);
        setStudyIndex((prev) => (prev + 1) % projectCards.length);
    }

    function handleShuffle() {
        if (projectCards.length <= 1) return;
        setIsFlipped(false);
        let randIndex = studyIndex;
        while (randIndex === studyIndex) {
            randIndex = Math.floor(Math.random() * projectCards.length);
        }
        setStudyIndex(randIndex);
    }

    // Dynamic Project Name parsing for header based on dynamic ID
    let projectTitle = t.headline;
    if (projectId === "proj-1") {
        projectTitle = "Chemistry 101";
    } else if (projectId === "proj-2") {
        projectTitle = "Calculus II";
    }

    return (
        <div className="layout-shell">
            {/* Navigation Header */}
            <header className="card-surface flex flex-col lg:flex-row justify-between items-center gap-space-sm">
                <span className="text-heading-lg">{t.title}</span>
                <div className="flex flex-col sm:flex-row items-center gap-space-md">
                    {/* Back Link to Dashboard */}
                    <Link
                        to="/dashboard"
                        className="text-body font-bold hover:underline"
                    >
                        {t.navBack}
                    </Link>

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
                </div>
            </header>

            {/* Page Main Content Workspace */}
            <main className="flex-1 flex flex-col gap-space-md py-space-md">
                {/* Title and Segmented Switcher */}
                <div className="flex flex-col md:flex-row justify-between items-center border-[var(--border-primary)] border-b-2 pb-space-sm gap-space-sm">
                    <h1 className="text-heading-lg text-3xl font-black uppercase tracking-tight">
                        {projectTitle}
                    </h1>

                    {/* Mode Segmented Controller Toggle */}
                    <div className="flex border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] p-1">
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode("study");
                                setIsFlipped(false);
                            }}
                            className={`px-space-md py-space-sm font-bold transition-all text-sm cursor-pointer ${
                                viewMode === "study"
                                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                    : "bg-transparent text-[var(--text-primary)] opacity-70"
                            }`}
                        >
                            {t.studyMode}
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("edit")}
                            className={`px-space-md py-space-sm font-bold transition-all text-sm cursor-pointer ${
                                viewMode === "edit"
                                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                                    : "bg-transparent text-[var(--text-primary)] opacity-70"
                            }`}
                        >
                            {t.editMode}
                        </button>
                    </div>
                </div>

                {/* STUDY MODE PANEL */}
                {viewMode === "study" && (
                    <div className="flex flex-col gap-space-md max-w-2xl mx-auto w-full py-space-lg">
                        {projectCards.length === 0 ? (
                            /* Empty Card State for Study mode */
                            <div className="card-surface border-dashed border-4 flex flex-col items-center justify-center p-space-lg text-center gap-space-md min-h-64">
                                <h3 className="text-heading-md text-xl">
                                    {t.noCardsTitle}
                                </h3>
                                <p className="text-body text-base">
                                    {t.noCardsText}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("edit")}
                                    className="btn-primary mt-space-sm"
                                >
                                    {t.editMode}
                                </button>
                            </div>
                        ) : (
                            /* Minimalist Card Deck Player */
                            <div className="flex flex-col gap-space-md">
                                <div className="text-sm font-mono text-center opacity-70 uppercase tracking-wider">
                                    {t.cardCounter
                                        .replace(
                                            "{current}",
                                            (studyIndex + 1).toString(),
                                        )
                                        .replace(
                                            "{total}",
                                            projectCards.length.toString(),
                                        )}
                                </div>

                                {/* Flashcard Component Canvas */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsFlipped((prev) => !prev)
                                    }
                                    className="card-surface w-full cursor-pointer min-h-64 flex flex-col items-center justify-center text-center p-space-lg gap-space-md transition-all select-none hover:scale-[1.01] active:scale-99"
                                >
                                    <span className="text-xs uppercase tracking-widest opacity-60 font-black">
                                        {isFlipped
                                            ? t.fieldAnswer.replace(" *", "")
                                            : t.fieldQuestion.replace(" *", "")}
                                    </span>
                                    <p className="text-heading-md text-2xl md:text-3xl max-w-xl break-words leading-relaxed font-black">
                                        {activeCard &&
                                            (isFlipped
                                                ? activeCard.answer
                                                : activeCard.question)}
                                    </p>
                                    <span className="text-xs uppercase tracking-wider font-bold border-[var(--border-primary)] border px-2 py-0.5 mt-space-md opacity-60">
                                        {t.flipPrompt}
                                    </span>
                                </button>

                                {/* Player Controls */}
                                <div className="flex justify-between items-center mt-space-sm gap-space-sm">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="btn-primary flex-1 sm:flex-initial"
                                    >
                                        ← {t.prevCard}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleShuffle}
                                        className="btn-primary bg-transparent text-[var(--text-primary)]"
                                    >
                                        🔀 {t.shuffleBtn}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="btn-primary flex-1 sm:flex-initial"
                                    >
                                        {t.nextCard} →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* EDIT MODE PANEL */}
                {viewMode === "edit" && (
                    <div className="flex flex-col gap-space-md">
                        <div className="flex justify-between items-center">
                            <span className="text-body font-bold opacity-80">
                                {projectCards.length} Flashcards
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                            >
                                + {t.createCardBtn}
                            </button>
                        </div>

                        {projectCards.length === 0 ? (
                            /* Empty Card Grid view */
                            <div className="card-surface border-dashed border-4 flex flex-col items-center justify-center p-space-lg text-center gap-space-md my-space-md min-h-64">
                                <h3 className="text-heading-md text-xl">
                                    {t.noCardsTitle}
                                </h3>
                                <p className="text-body text-base">
                                    {t.noCardsText}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn-primary mt-space-sm"
                                >
                                    + {t.createCardBtn}
                                </button>
                            </div>
                        ) : (
                            /* Listing Cards Grid */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-sm">
                                {projectCards.map((card) => (
                                    <section
                                        key={card.id}
                                        className="card-surface flex flex-col justify-between gap-space-sm relative p-space-md"
                                    >
                                        {/* Card Deletion Trigger */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteCard(card.id)
                                            }
                                            className="absolute top-2 right-2 text-sm font-black text-red-600 hover:text-red-500 hover:scale-110 transition-all p-1"
                                            title="Delete Card"
                                        >
                                            ✕
                                        </button>
                                        <div className="flex flex-col gap-space-sm">
                                            <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                                {t.fieldQuestion.replace(
                                                    " *",
                                                    "",
                                                )}
                                            </span>
                                            <p className="text-body font-bold pr-6">
                                                {card.question}
                                            </p>
                                            <hr className="border-[var(--border-primary)]" />
                                            <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                                {t.fieldAnswer.replace(
                                                    " *",
                                                    "",
                                                )}
                                            </span>
                                            <p className="text-body">
                                                {card.answer}
                                            </p>
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Card Dialog Slide-Over Overlay Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 dark:bg-white/20 backdrop-blur-xs flex items-center justify-center p-space-md z-50 animate-fadeIn">
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
                                    htmlFor="card-question"
                                    className="text-body font-bold"
                                >
                                    {t.fieldQuestion}
                                </label>
                                <textarea
                                    id="card-question"
                                    value={formQuestion}
                                    onChange={(e) =>
                                        handleQuestionChange(e.target.value)
                                    }
                                    placeholder={t.placeholderQuestion}
                                    rows={3}
                                    className="card-surface p-2 w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                                    required
                                />
                                {errorQuestion && (
                                    <span className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        {errorQuestion}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-space-sm">
                                <label
                                    htmlFor="card-answer"
                                    className="text-body font-bold"
                                >
                                    {t.fieldAnswer}
                                </label>
                                <textarea
                                    id="card-answer"
                                    value={formAnswer}
                                    onChange={(e) =>
                                        handleAnswerChange(e.target.value)
                                    }
                                    placeholder={t.placeholderAnswer}
                                    rows={3}
                                    className="card-surface p-2 w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                                    required
                                />
                                {errorAnswer && (
                                    <span className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        {errorAnswer}
                                    </span>
                                )}
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

export default ProjectWorkspace;
