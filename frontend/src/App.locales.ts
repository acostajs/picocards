export type AppTranslations = {
    dashboardTitle: string;
    backToHome: string;
    workspaceTitle: string;
    workspaceDesc: string;
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
};

export const locales: Record<"en" | "fr" | "es", AppTranslations> = {
    en: {
        dashboardTitle: "PicoCards Dashboard",
        backToHome: "Back to Home",
        workspaceTitle: "Your Workspace",
        workspaceDesc:
            "Welcome to your study dashboard. This workspace will connect with Phase 1.3 features.",
        notFoundTitle: "404",
        notFoundDesc: "Page Not Found",
        goHome: "Go Home",
    },
    fr: {
        dashboardTitle: "Tableau de Bord PicoCards",
        backToHome: "Retour à l'accueil",
        workspaceTitle: "Votre Espace de Travail",
        workspaceDesc:
            "Bienvenue dans votre tableau de bord d'étude. Cet espace sera connecté aux fonctionnalités de la Phase 1.3.",
        notFoundTitle: "404",
        notFoundDesc: "Page Non Trouvée",
        goHome: "Aller à l'accueil",
    },
    es: {
        dashboardTitle: "Tablero de PicoCards",
        backToHome: "Volver al inicio",
        workspaceTitle: "Tu Espacio de Trabajo",
        workspaceDesc:
            "Bienvenido a tu tablero de estudio. Este espacio se conectará con las funciones de la Fase 1.3.",
        notFoundTitle: "404",
        notFoundDesc: "Página No Encontrada",
        goHome: "Ir al inicio",
    },
};
