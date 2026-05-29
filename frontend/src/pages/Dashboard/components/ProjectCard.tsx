import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../types";

type ProjectCardProps = {
    project: Project;
    onDelete: (id: string) => void;
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
    function handleDeleteClick(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        onDelete(project.id);
    }

    return (
        <Link
            to={`/projects/${project.id}`}
            className="no-underline text-[var(--text-primary)] hover:no-underline flex"
        >
            <section className="card-surface flex flex-col justify-between gap-space-md hover:scale-[1.01] hover:shadow-md cursor-pointer w-full">
                <div className="flex flex-col gap-space-sm">
                    <div className="flex justify-between items-start gap-space-sm">
                        <h2 className="text-heading-md text-xl font-bold uppercase tracking-tight">
                            {project.title}
                        </h2>
                        <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="text-sm font-black text-red-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all p-1"
                            title="Delete Deck"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-body text-sm line-clamp-3">
                        {project.description || "—"}
                    </p>
                </div>
                <div className="text-xs opacity-60 font-mono mt-auto flex justify-between">
                    <span>ID: {project.id}</span>
                    <span>{project.created_at}</span>
                </div>
            </section>
        </Link>
    );
}

export default ProjectCard;
