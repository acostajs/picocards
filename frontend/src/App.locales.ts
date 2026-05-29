export type AppTranslations = {
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
};

export const locales: Record<"en" | "fr" | "es", AppTranslations> = {
    en: {
        notFoundTitle: "404",
        notFoundDesc: "Page Not Found",
        goHome: "Go Home",
    },
    fr: {
        notFoundTitle: "404",
        notFoundDesc: "Page Non Trouvée",
        goHome: "Aller à l'accueil",
    },
    es: {
        notFoundTitle: "404",
        notFoundDesc: "Página No Encontrada",
        goHome: "Ir al inicio",
    },
};
