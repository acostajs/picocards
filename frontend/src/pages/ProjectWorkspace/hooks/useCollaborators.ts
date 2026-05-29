import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import type { Collaborator } from "../types";

type BackendCollaborator = {
    project_id: string;
    user_id: string;
    email: string;
    role: "owner" | "editor" | "visitor";
    joined_at: string;
};

export function useCollaborators(projectId: string | undefined) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

    const projectCollaborators = collaborators;

    // Load collaborators on project mount/change
    useEffect(() => {
        if (projectId) {
            api.get<BackendCollaborator[]>(
                `/api/projects/${projectId}/collaborators`,
            )
                .then((data) => {
                    const mapped = data.map((c) => ({
                        id: c.user_id, // Map backend user_id cleanly to UI id
                        project_id: c.project_id,
                        email: c.email,
                        role: c.role,
                    }));
                    setCollaborators(mapped);
                })
                .catch((err) => {
                    console.error("Failed to fetch collaborators:", err);
                });
        } else {
            setCollaborators([]);
        }
    }, [projectId]);

    function handleInviteCollaborator(email: string) {
        if (!projectId) return;
        api.post<BackendCollaborator>(
            `/api/projects/${projectId}/collaborators`,
            {
                email,
                role: "editor",
            },
        )
            .then((newCollab) => {
                const mapped: Collaborator = {
                    id: newCollab.user_id,
                    project_id: newCollab.project_id,
                    email: newCollab.email,
                    role: newCollab.role,
                };
                setCollaborators((prev) => [...prev, mapped]);
            })
            .catch((err) => {
                alert(err.message || "Failed to invite collaborator");
            });
    }

    function handleRemoveCollaborator(id: string) {
        if (!projectId) return;
        api.delete(`/api/projects/${projectId}/collaborators/${id}`)
            .then(() => {
                setCollaborators((prev) => prev.filter((c) => c.id !== id));
            })
            .catch((err) => {
                alert(err.message || "Failed to remove collaborator");
            });
    }

    return {
        projectCollaborators,
        handleInviteCollaborator,
        handleRemoveCollaborator,
    };
}
