export type WorkspaceTranslations = {
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

    // Collaborators Mode
    collaboratorsMode: string;
    collabHeadline: string;
    inviteLabel: string;
    invitePlaceholder: string;
    inviteBtn: string;
    collabHeaderEmail: string;
    collabHeaderRole: string;
    collabHeaderAction: string;
    noCollaborators: string;
    errEmailRequired: string;
    errEmailInvalid: string;
    errEmailAlreadyExists: string;

    // New additions for clean code refactor
    cardCount: string;
    deleteCardTooltip: string;
    removeCollabTooltip: string;
    confirmDeleteCard: string;
    confirmRemoveCollaborator: string;
    questionLabel: string;
    answerLabel: string;
};

export const locales: Record<"en" | "fr" | "es", WorkspaceTranslations> = {
    en: {
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
        collaboratorsMode: "Collaborators",
        collabHeadline: "Manage Collaboration Settings",
        inviteLabel: "Invite Classmate (Email) *",
        invitePlaceholder: "classmate@hub.ca",
        inviteBtn: "Invite",
        collabHeaderEmail: "Email",
        collabHeaderRole: "Role",
        collabHeaderAction: "Action",
        noCollaborators: "No active collaborators in this workspace.",
        errEmailRequired: "Email address is required.",
        errEmailInvalid: "Please enter a valid email address.",
        errEmailAlreadyExists:
            "This collaborator has already been invited or added.",
        cardCount: "{count} Flashcards",
        deleteCardTooltip: "Delete Card",
        removeCollabTooltip: "Remove Collaborator",
        confirmDeleteCard: "Are you sure you want to delete this card?",
        confirmRemoveCollaborator:
            "Are you sure you want to remove this collaborator?",
        questionLabel: "Front Canvas (Question)",
        answerLabel: "Back Canvas (Answer)",
    },
    fr: {
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
        collaboratorsMode: "Collaborateurs",
        collabHeadline: "Gérer les paramètres de collaboration",
        inviteLabel: "Inviter un camarade (E-mail) *",
        invitePlaceholder: "camarade@hub.ca",
        inviteBtn: "Inviter",
        collabHeaderEmail: "E-mail",
        collabHeaderRole: "Rôle",
        collabHeaderAction: "Action",
        noCollaborators: "Aucun collaborateur actif dans cet espace.",
        errEmailRequired: "L'e-mail est requis.",
        errEmailInvalid: "Veuillez saisir une adresse e-mail valide.",
        errEmailAlreadyExists: "Ce collaborateur a déjà été invité ou ajouté.",
        cardCount: "{count} fiches",
        deleteCardTooltip: "Supprimer la carte",
        removeCollabTooltip: "Retirer le collaborateur",
        confirmDeleteCard: "Êtes-vous sûr de vouloir supprimer cette carte ?",
        confirmRemoveCollaborator:
            "Êtes-vous sûr de vouloir retirer ce collaborateur ?",
        questionLabel: "Recto (Question)",
        answerLabel: "Verso (Réponse)",
    },
    es: {
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
        collaboratorsMode: "Colaboradores",
        collabHeadline: "Gestionar configuración de colaboración",
        inviteLabel: "Invitar compañero (Correo) *",
        invitePlaceholder: "companero@hub.ca",
        inviteBtn: "Invitar",
        collabHeaderEmail: "Correo",
        collabHeaderRole: "Rol",
        collabHeaderAction: "Acción",
        noCollaborators: "No hay colaboradores activos en este espacio.",
        errEmailRequired: "El correo es requerido.",
        errEmailInvalid: "Por favor, ingrese un correo válido.",
        errEmailAlreadyExists:
            "Este colaborador ya ha sido invitado o agregado.",
        cardCount: "{count} tarjetas",
        deleteCardTooltip: "Eliminar tarjeta",
        removeCollabTooltip: "Eliminar colaborador",
        confirmDeleteCard: "¿Está seguro de que desea eliminar esta tarjeta?",
        confirmRemoveCollaborator:
            "¿Está seguro de que desea retirar a este colaborador?",
        questionLabel: "Frente (Pregunta)",
        answerLabel: "Reverso (Respuesta)",
    },
};
