export type WorkspaceTranslations = {
    title: string;
    navBack: string;
    headline: string;
    studyMode: string;
    editMode: string;
    createCardBtn: string;
    noCardsTitle: string;
    noCardsText: string;

    // Card Creator Modal
    modalTitle: string;
    fieldQuestion: string;
    fieldAnswer: string;
    placeholderQuestion: string;
    placeholderAnswer: string;
    saveBtn: string;
    cancelBtn: string;

    // Validations
    errQuestionRequired: string;
    errAnswerRequired: string;

    // Study Mode
    flipPrompt: string;
    prevCard: string;
    nextCard: string;
    shuffleBtn: string;
    cardCounter: string;

    // Language & Theme
    langSelect: string;
    themeToggle: string;
    themeLight: string;
    themeDark: string;
};

export const locales: Record<"en" | "fr" | "es", WorkspaceTranslations> = {
    en: {
        title: "PicoCards",
        navBack: "Back to Dashboard",
        headline: "Study Workspace",
        studyMode: "Study Mode",
        editMode: "Edit Mode",
        createCardBtn: "Create Card",
        noCardsTitle: "No flashcards yet",
        noCardsText:
            "Switch to Edit Mode to create your first flashcard with a Question and Answer!",
        modalTitle: "Create New Card",
        fieldQuestion: "Front Canvas (Question) *",
        fieldAnswer: "Back Canvas (Answer) *",
        placeholderQuestion: "Enter the question or concept...",
        placeholderAnswer: "Enter the answer or definition...",
        saveBtn: "Add Flashcard",
        cancelBtn: "Cancel",
        errQuestionRequired: "Question is required.",
        errAnswerRequired: "Answer is required.",
        flipPrompt: "Click to flip",
        prevCard: "Previous",
        nextCard: "Next",
        shuffleBtn: "Shuffle Deck",
        cardCounter: "Card {current} of {total}",
        langSelect: "Select Language:",
        themeToggle: "Theme:",
        themeLight: "Light",
        themeDark: "Dark",
    },
    fr: {
        title: "PicoCards",
        navBack: "Retour au Tableau de Bord",
        headline: "Espace de Travail",
        studyMode: "Mode d'Étude",
        editMode: "Mode d'Édition",
        createCardBtn: "Créer une Carte",
        noCardsTitle: "Aucune carte d'étude",
        noCardsText:
            "Basculez en mode d'édition pour créer votre première carte avec une question et une réponse !",
        modalTitle: "Créer une Nouvelle Carte",
        fieldQuestion: "Recto (Question) *",
        fieldAnswer: "Verso (Réponse) *",
        placeholderQuestion: "Saisissez la question ou le concept...",
        placeholderAnswer: "Saisissez la réponse ou la définition...",
        saveBtn: "Ajouter la Carte",
        cancelBtn: "Annuler",
        errQuestionRequired: "La question est requise.",
        errAnswerRequired: "La réponse est requise.",
        flipPrompt: "Cliquer pour retourner",
        prevCard: "Précédent",
        nextCard: "Suivant",
        shuffleBtn: "Mélanger le Deck",
        cardCounter: "Carte {current} sur {total}",
        langSelect: "Choisir la langue:",
        themeToggle: "Thème:",
        themeLight: "Clair",
        themeDark: "Sombre",
    },
    es: {
        title: "PicoCards",
        navBack: "Volver al Tablero",
        headline: "Espacio de Estudio",
        studyMode: "Modo de Estudio",
        editMode: "Modo de Edición",
        createCardBtn: "Crear Tarjeta",
        noCardsTitle: "Aún no hay tarjetas",
        noCardsText:
            "¡Cambia al modo de edición para crear tu primera tarjeta con pregunta y respuesta!",
        modalTitle: "Crear Nuevo Tarjeta",
        fieldQuestion: "Frente (Pregunta) *",
        fieldAnswer: "Reverso (Respuesta) *",
        placeholderQuestion: "Ingresa la pregunta o concepto...",
        placeholderAnswer: "Ingresa la respuesta o definición...",
        saveBtn: "Agregar Tarjeta",
        cancelBtn: "Cancelar",
        errQuestionRequired: "La pregunta es requerida.",
        errAnswerRequired: "La respuesta es requerida.",
        flipPrompt: "Haz clic para voltear",
        prevCard: "Anterior",
        nextCard: "Siguiente",
        shuffleBtn: "Mezclar Mazo",
        cardCounter: "Tarjeta {current} de {total}",
        langSelect: "Seleccionar idioma:",
        themeToggle: "Tema:",
        themeLight: "Claro",
        themeDark: "Oscuro",
    },
};
