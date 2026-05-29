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
                    {projectCards.length} Flashcards
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
                                onClick={() => onDeleteCard(card.id)}
                                className="absolute top-2 right-2 text-sm font-black text-red-600 hover:text-red-500 hover:scale-110 transition-all p-1"
                                title="Delete Card"
                            >
                                ✕
                            </button>
                            <div className="flex flex-col gap-space-sm">
                                <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                    {t.fieldQuestion.replace(" *", "")}
                                </span>
                                <p className="text-body font-bold pr-6">
                                    {card.question}
                                </p>
                                <hr className="border-[var(--border-primary)]" />
                                <span className="text-xs uppercase tracking-wider opacity-60 font-black">
                                    {t.fieldAnswer.replace(" *", "")}
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

export default EditModeView;
