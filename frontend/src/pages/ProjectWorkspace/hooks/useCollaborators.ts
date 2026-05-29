import { useState } from "react";
import type { Collaborator } from "../types";

export function useCollaborators(
    projectId: string | undefined,
    initialCollaborators: Collaborator[],
) {
    const [collaborators, setCollaborators] =
        useState<Collaborator[]>(initialCollaborators);

    const projectCollaborators = collaborators.filter(
        (c) => c.project_id === projectId,
    );

    function handleInviteCollaborator(email: string) {
        const newCollab: Collaborator = {
            id: `collab-${Date.now()}`,
            project_id: projectId || "proj-1",
            email,
            role: "editor",
        };
        setCollaborators((prev) => [...prev, newCollab]);
    }

    function handleRemoveCollaborator(id: string) {
        setCollaborators((prev) => prev.filter((c) => c.id !== id));
    }

    return {
        projectCollaborators,
        handleInviteCollaborator,
        handleRemoveCollaborator,
    };
}
