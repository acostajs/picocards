export type DashboardTranslations = {
    navBack: string;
    logoutBtn: string;
    headline: string;
    createBtn: string;
    emptyTitle: string;
    emptyText: string;

    // Modal
    modalTitle: string;
    fieldTitle: string;
    fieldDesc: string;
    placeholderTitle: string;
    placeholderDesc: string;
    saveBtn: string;
    cancelBtn: string;

    // Validation
    errTitleRequired: string;
    errTitleTooLong: string;

    // New additions for clean code refactor
    deleteDeckTooltip: string;
    projectIdLabel: string;
    confirmDeleteProject: string;
};

export const locales: Record<"en" | "fr" | "es", DashboardTranslations> = {
    en: {
        navBack: "Back to Hub",
        logoutBtn: "Logout",
        headline: "Your Study Decks",
        createBtn: "Create Deck",
        emptyTitle: "No study decks yet",
        emptyText:
            "Create your first workspace deck to start organizing your materials and practicing!",
        modalTitle: "Create New Deck",
        fieldTitle: "Title",
        fieldDesc: "Description",
        placeholderTitle: "e.g., Chemistry 101",
        placeholderDesc: "Detailed scope or exam deadlines (optional)",
        saveBtn: "Create Workspace",
        cancelBtn: "Cancel",
        errTitleRequired: "Title is required.",
        errTitleTooLong: "Title must be 100 characters or less.",
        deleteDeckTooltip: "Delete Deck",
        projectIdLabel: "ID: {id}",
        confirmDeleteProject: "Are you sure you want to delete this deck?",
    },
    fr: {
        navBack: "Retour à Hub",
        logoutBtn: "Se déconnecter",
        headline: "Vos Decks d'Étude",
        createBtn: "Créer un Deck",
        emptyTitle: "Aucun deck d'étude pour le moment",
        emptyText:
            "Créez votre premier deck d'étude pour commencer à organiser vos cours et réviser !",
        modalTitle: "Créer un Nouveau Deck",
        fieldTitle: "Titre",
        fieldDesc: "Description",
        placeholderTitle: "ex. Chimie 101",
        placeholderDesc: "Objectifs ou dates d'examens (optionnel)",
        saveBtn: "Créer l'Espace",
        cancelBtn: "Annuler",
        errTitleRequired: "Le titre est requis.",
        errTitleTooLong: "Le titre doit faire 100 caractères ou moins.",
        deleteDeckTooltip: "Supprimer le deck",
        projectIdLabel: "ID: {id}",
        confirmDeleteProject: "Êtes-vous sûr de vouloir supprimer ce deck ?",
    },
    es: {
        navBack: "Volver a Hub",
        logoutBtn: "Cerrar sesión",
        headline: "Tus Mazos de Estudio",
        createBtn: "Crear Mazo",
        emptyTitle: "Aún no hay mazos de estudio",
        emptyText:
            "¡Crea tu primer mazo de trabajo para empezar a organizar tus materias y practicar!",
        modalTitle: "Crear Nuevo Mazo",
        fieldTitle: "Título",
        fieldDesc: "Descripción",
        placeholderTitle: "ej. Química 101",
        placeholderDesc: "Alcance detallado o fechas de exámenes (opcional)",
        saveBtn: "Crear Espacio",
        cancelBtn: "Cancelar",
        errTitleRequired: "El título es requerido.",
        errTitleTooLong: "El título debe tener 100 caracteres o menos.",
        deleteDeckTooltip: "Eliminar mazo",
        projectIdLabel: "ID: {id}",
        confirmDeleteProject: "¿Está seguro de que desea eliminar este mazo?",
    },
};
