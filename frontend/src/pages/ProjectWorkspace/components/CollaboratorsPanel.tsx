import { type SyntheticEvent, useState } from "react";
import type { WorkspaceTranslations } from "../ProjectWorkspace.locales";
import type { Collaborator } from "../types";

type CollaboratorsPanelProps = {
    collaborators: Collaborator[];
    onInvite: (email: string) => void;
    onRemove: (id: string) => void;
    t: WorkspaceTranslations;
};

export function CollaboratorsPanel({
    collaborators,
    onInvite,
    onRemove,
    t,
}: CollaboratorsPanelProps) {
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);

    function validateEmail(email: string): boolean {
        if (email.trim() === "") {
            setEmailError(t.errEmailRequired);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(t.errEmailInvalid);
            return false;
        }

        const alreadyExists = collaborators.some(
            (c) => c.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (alreadyExists) {
            setEmailError(t.errEmailAlreadyExists);
            return false;
        }

        setEmailError(null);
        return true;
    }

    function handleInviteSubmit(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmedEmail = emailInput.trim();

        if (!validateEmail(trimmedEmail)) {
            return;
        }

        onInvite(trimmedEmail);
        setEmailInput("");
        setEmailError(null);
    }

    return (
        <div className="flex flex-col gap-space-lg max-w-3xl mx-auto w-full py-space-md">
            {/* Invite Form Card */}
            <section className="card-surface flex flex-col gap-space-md">
                <h3 className="text-heading-md text-xl font-black uppercase tracking-tight">
                    {t.collabHeadline}
                </h3>
                <form
                    onSubmit={handleInviteSubmit}
                    className="flex flex-col sm:flex-row gap-space-md items-stretch sm:items-end"
                >
                    <div className="flex flex-col gap-space-sm w-full sm:flex-1">
                        <label
                            htmlFor="collab-email"
                            className="text-body font-bold"
                        >
                            {t.inviteLabel}
                        </label>
                        <input
                            id="collab-email"
                            type="text"
                            value={emailInput}
                            onChange={(e) => {
                                setEmailInput(e.target.value);
                                if (emailError) {
                                    setEmailError(null);
                                }
                            }}
                            placeholder={t.invitePlaceholder}
                            className="card-surface p-space-sm w-full outline-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--text-primary)]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary w-full sm:w-auto flex items-center justify-center cursor-pointer"
                    >
                        {t.inviteBtn}
                    </button>
                </form>
                {emailError && (
                    <span className="border-2 border-[var(--border-primary)] p-space-xs bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-bold uppercase tracking-wide inline-block mt-space-xs max-w-max">
                        {emailError}
                    </span>
                )}
            </section>

            {/* Collaborators List Card */}
            <section className="card-surface flex flex-col gap-space-md">
                <h3 className="text-heading-md text-xl font-black uppercase tracking-tight">
                    {t.collaboratorsMode}
                </h3>

                {collaborators.length === 0 ? (
                    <p className="text-body text-base opacity-70 italic">
                        {t.noCollaborators}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-[var(--border-primary)] text-left">
                            <thead>
                                <tr className="bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold">
                                    <th className="p-space-sm border-[var(--border-primary)] border-b-2">
                                        {t.collabHeaderEmail}
                                    </th>
                                    <th className="p-space-sm border-[var(--border-primary)] border-b-2">
                                        {t.collabHeaderRole}
                                    </th>
                                    <th className="p-space-sm border-[var(--border-primary)] border-b-2 text-right">
                                        {t.collabHeaderAction}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {collaborators.map((collab) => (
                                    <tr
                                        key={collab.id}
                                        className="border-b-[var(--border-primary)] border-b"
                                    >
                                        <td className="p-space-sm text-body font-bold break-all">
                                            {collab.email}
                                        </td>
                                        <td className="p-space-sm">
                                            <span className="text-xs uppercase tracking-wider font-bold border-[var(--border-primary)] border px-space-sm py-space-xs opacity-80">
                                                {collab.role}
                                            </span>
                                        </td>
                                        <td className="p-space-sm text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            t.confirmRemoveCollaborator,
                                                        )
                                                    ) {
                                                        onRemove(collab.id);
                                                    }
                                                }}
                                                className="text-sm font-black text-[var(--text-primary)] hover:opacity-70 hover:scale-110 active:scale-95 transition-all p-space-xs cursor-pointer"
                                                title={t.removeCollabTooltip}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
