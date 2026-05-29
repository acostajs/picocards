export type HeaderTranslations = {
    title: string;
    langSelect: string;
    themeToggle: string;
    themeLight: string;
    themeDark: string;
};

export const locales: Record<"en" | "fr" | "es", HeaderTranslations> = {
    en: {
        title: "PicoCards",
        langSelect: "Select Language:",
        themeToggle: "Theme:",
        themeLight: "Light",
        themeDark: "Dark",
    },
    fr: {
        title: "PicoCards",
        langSelect: "Choisir la langue:",
        themeToggle: "Thème:",
        themeLight: "Clair",
        themeDark: "Sombre",
    },
    es: {
        title: "PicoCards",
        langSelect: "Seleccionar idioma:",
        themeToggle: "Tema:",
        themeLight: "Claro",
        themeDark: "Oscuro",
    },
};
