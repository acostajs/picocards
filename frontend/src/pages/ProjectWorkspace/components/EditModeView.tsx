import type { WorkspaceTranslations } from "../ProjectWorkspace.locales";
import type { Card } from "../types";

type EditModeViewProps = {
    projectCards: Card[];
    onDeleteCard: (id: string) => void;
    onCreateCardClick: () => void;
    t: WorkspaceTranslations;
};

export function EditModeView({
    projectCards,
    onDeleteCard,
    onCreateCardClick,
    t,
}: EditModeViewProps) {
    return (
        <div className="flex flex-col gap-space-md">
            <div className="flex justify-between items-center">
                <span className="text-body font-bold opacity-80">
                    {t.cardCount.replace(
                        "{count}",
                        projectCards.length.toString(),
                    )}
                </span>
                <button
                    type="button"
                    onClick={onCreateCardClick}
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
                    <p className="text-body text-base">{t.noCardsText}</p>
                    <button
                        type="button"
                        onClick={onCreateCardClick}
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
                                onClick={() => {
                                    if (window.confirm(t.confirmDeleteCard)) {
                                        onDeleteCard(card.id);
                                    }
                                }}
                                className="absolute top-space-sm right-space-sm text-sm font-black text-[var(--text-primary)] hover:opacity-70 hover:scale-110 active:scale-95 transition-all p-space-xs cursor-pointer"
                                title={t.deleteCardTooltip}
                            >
                                ✕
                            </button>
                            <div className="flex flex-col gap-space-sm">
                                <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                    {t.questionLabel}
                                </span>
                                <p className="text-body font-bold pr-6">
                                    {card.question}
                                </p>
                                <hr className="border-[var(--border-primary)]" />
                                <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                    {t.answerLabel}
                                </span>
                                <p className="text-body">{card.answer}</p>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
