export type DashboardTranslations = {
    title: string;
    navBack: string;
    logoutBtn: string;
    headline: string;
    createBtn: string;
    emptyTitle: string;
    emptyText: string;
    skeletonLoading: string;

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

    // Theme & Language
    langSelect: string;
    themeToggle: string;
    themeLight: string;
    themeDark: string;
};

export const locales: Record<"en" | "fr" | "es", DashboardTranslations> = {
    en: {
        title: "PicoCards",
        navBack: "Back to Hub",
        logoutBtn: "Logout",
        headline: "Your Study Decks",
        createBtn: "Create Deck",
        emptyTitle: "No study decks yet",
        emptyText:
            "Create your first workspace deck to start organizing your materials and practicing!",
        skeletonLoading: "Loading decks...",
        modalTitle: "Create New Deck",
        fieldTitle: "Title",
        fieldDesc: "Description",
        placeholderTitle: "e.g., Chemistry 101",
        placeholderDesc: "Detailed scope or exam deadlines (optional)",
        saveBtn: "Create Workspace",
        cancelBtn: "Cancel",
        errTitleRequired: "Title is required.",
        errTitleTooLong: "Title must be 100 characters or less.",
        langSelect: "Select Language:",
        themeToggle: "Theme:",
        themeLight: "Light",
        themeDark: "Dark",
    },
    fr: {
        title: "PicoCards",
        navBack: "Retour à Hub",
        logoutBtn: "Se déconnecter",
        headline: "Vos Decks d'Étude",
        createBtn: "Créer un Deck",
        emptyTitle: "Aucun deck d'étude pour le moment",
        emptyText:
            "Créez votre premier deck d'étude pour commencer à organiser vos cours et réviser !",
        skeletonLoading: "Chargement des decks...",
        modalTitle: "Créer un Nouveau Deck",
        fieldTitle: "Titre",
        fieldDesc: "Description",
        placeholderTitle: "ex. Chimie 101",
        placeholderDesc: "Objectifs ou dates d'examens (optionnel)",
        saveBtn: "Créer l'Espace",
        cancelBtn: "Annuler",
        errTitleRequired: "Le titre est requis.",
        errTitleTooLong: "Le titre doit faire 100 caractères ou moins.",
        langSelect: "Choisir la langue:",
        themeToggle: "Thème:",
        themeLight: "Clair",
        themeDark: "Sombre",
    },
    es: {
        title: "PicoCards",
        navBack: "Volver a Hub",
        logoutBtn: "Cerrar sesión",
        headline: "Tus Mazos de Estudio",
        createBtn: "Crear Mazo",
        emptyTitle: "Aún no hay mazos de estudio",
        emptyText:
            "¡Crea tu primer mazo de trabajo para empezar a organizar tus materias y practicar!",
        skeletonLoading: "Cargando mazos...",
        modalTitle: "Crear Nuevo Mazo",
        fieldTitle: "Título",
        fieldDesc: "Descripción",
        placeholderTitle: "ej. Química 101",
        placeholderDesc: "Alcance detallado o fechas de exámenes (opcional)",
        saveBtn: "Crear Espacio",
        cancelBtn: "Cancelar",
        errTitleRequired: "El título es requerido.",
        errTitleTooLong: "El título debe tener 100 caracteres o menos.",
        langSelect: "Seleccionar idioma:",
        themeToggle: "Tema:",
        themeLight: "Claro",
        themeDark: "Oscuro",
    },
};
