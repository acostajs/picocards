export type Card = {
    id: string;
    project_id: string;
    question: string;
    answer: string;
};

export type Collaborator = {
    id: string;
    project_id: string;
    email: string;
    role: "owner" | "editor" | "visitor";
};
