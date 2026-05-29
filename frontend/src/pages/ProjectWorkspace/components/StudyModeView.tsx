import type { WorkspaceTranslations } from "../ProjectWorkspace.locales";
import type { Card } from "../types";

type StudyModeViewProps = {
    projectCards: Card[];
    studyIndex: number;
    isFlipped: boolean;
    onFlip: () => void;
    onPrev: () => void;
    onNext: () => void;
    onShuffle: () => void;
    t: WorkspaceTranslations;
    onSwitchToEdit: () => void;
};

export function StudyModeView({
    projectCards,
    studyIndex,
    isFlipped,
    onFlip,
    onPrev,
    onNext,
    onShuffle,
    t,
    onSwitchToEdit,
}: StudyModeViewProps) {
    if (projectCards.length === 0) {
        return (
            <div className="flex flex-col gap-space-md max-w-2xl mx-auto w-full py-space-lg">
                <div className="card-surface border-dashed border-4 flex flex-col items-center justify-center p-space-lg text-center gap-space-md min-h-64">
                    <h3 className="text-heading-md text-xl">
                        {t.noCardsTitle}
                    </h3>
                    <p className="text-body text-base">{t.noCardsText}</p>
                    <button
                        type="button"
                        onClick={onSwitchToEdit}
                        className="btn-primary mt-space-sm"
                    >
                        {t.editMode}
                    </button>
                </div>
            </div>
        );
    }

    const activeCard = projectCards.at(studyIndex);

    return (
        <div className="flex flex-col gap-space-md max-w-2xl mx-auto w-full py-space-lg">
            <div className="flex flex-col gap-space-md">
                <div className="text-sm font-mono text-center opacity-70 uppercase tracking-wider">
                    {t.cardCounter
                        .replace("{current}", (studyIndex + 1).toString())
                        .replace("{total}", projectCards.length.toString())}
                </div>

                {/* Flashcard Component Canvas */}
                <button
                    type="button"
                    onClick={onFlip}
                    className="card-surface w-full cursor-pointer min-h-64 flex flex-col items-center justify-center text-center p-space-lg gap-space-md transition-all select-none hover:scale-[1.01] active:scale-99"
                >
                    <span className="text-xs uppercase tracking-widest opacity-60 font-black">
                        {isFlipped ? t.answerLabel : t.questionLabel}
                    </span>
                    <p className="text-heading-md text-2xl md:text-3xl max-w-xl break-words leading-relaxed font-black">
                        {activeCard &&
                            (isFlipped
                                ? activeCard.answer
                                : activeCard.question)}
                    </p>
                    <span className="text-xs uppercase tracking-wider font-bold border-[var(--border-primary)] border px-space-sm py-space-xs mt-space-md opacity-60">
                        {t.flipPrompt}
                    </span>
                </button>

                {/* Player Controls */}
                <div className="flex justify-between items-center mt-space-sm gap-space-sm">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="btn-primary flex-1 sm:flex-initial"
                    >
                        ← {t.prevCard}
                    </button>
                    <button
                        type="button"
                        onClick={onShuffle}
                        className="btn-primary bg-transparent text-[var(--text-primary)]"
                    >
                        🔀 {t.shuffleBtn}
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="btn-primary flex-1 sm:flex-initial"
                    >
                        {t.nextCard} →
                    </button>
                </div>
            </div>
        </div>
    );
}
