import { type SyntheticEvent, useState } from "react";
import type { DashboardTranslations } from "../Dashboard.locales";

type CreateProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string) => void;
    t: DashboardTranslations;
};

export function CreateProjectModal({
    isOpen,
    onClose,
    onSubmit,
    t,
}: CreateProjectModalProps) {
    const [formTitle, setFormTitle] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [errorTitle, setErrorTitle] = useState<string | null>(null);

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

    function handleFormSubmit(e: SyntheticEvent<HTMLFormElement>) {
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

        onSubmit(trimmedTitle, formDesc.trim());
        // Reset states
        setFormTitle("");
        setFormDesc("");
        setErrorTitle(null);
    }

    function handleCancelClick() {
        setFormTitle("");
        setFormDesc("");
        setErrorTitle(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
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
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder={t.placeholderTitle}
                            className="card-surface p-space-sm w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                            required
                        />
                        {errorTitle && (
                            <span className="border-2 border-[var(--border-primary)] p-space-xs bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-bold uppercase tracking-wide inline-block mt-space-xs max-w-max">
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
                            onChange={(e) => setFormDesc(e.target.value)}
                            placeholder={t.placeholderDesc}
                            rows={4}
                            className="card-surface p-space-sm w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                        />
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
