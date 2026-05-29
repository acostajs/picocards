import { type SyntheticEvent, useState } from "react";
import type { WorkspaceTranslations } from "../ProjectWorkspace.locales";

type CreateCardModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (question: string, answer: string) => void;
    t: WorkspaceTranslations;
};

export function CreateCardModal({
    isOpen,
    onClose,
    onSubmit,
    t,
}: CreateCardModalProps) {
    const [formQuestion, setFormQuestion] = useState("");
    const [formAnswer, setFormAnswer] = useState("");
    const [errorQuestion, setErrorQuestion] = useState<string | null>(null);
    const [errorAnswer, setErrorAnswer] = useState<string | null>(null);

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

        onSubmit(trimmedQ, trimmedA);
        // Reset states
        setFormQuestion("");
        setFormAnswer("");
        setErrorQuestion(null);
        setErrorAnswer(null);
    }

    function handleCancelClick() {
        setFormQuestion("");
        setFormAnswer("");
        setErrorQuestion(null);
        setErrorAnswer(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
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
                            onChange={(e) => handleAnswerChange(e.target.value)}
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
                            onClick={handleCancelClick}
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
    );
}

export default CreateCardModal;
