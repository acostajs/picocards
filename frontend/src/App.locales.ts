export type AppTranslations = {
    title: string;
    description: string;
    langLabel: string;
    cardTitle: string;
    cardText: string;
    buttonText: string;
};

export const locales: Record<"en" | "fr" | "es", AppTranslations> = {
    en: {
        title: "PicoCards Foundations",
        description:
            "Your global high-contrast monochromatic design system and typesafe i18n localization are fully operational.",
        langLabel: "Select Language:",
        cardTitle: "System Integrity Verified",
        cardText:
            "Both the local pre-commit gates (Lefthook, Biome, Ruff) and the cloud CI/CD workflows are correctly configured. Spacing uses fluid, semantic tokens.",
        buttonText: "Verify Spacing Scale",
    },
    fr: {
        title: "Fondations PicoCards",
        description:
            "Votre système de conception monochrome à contraste élevé et votre localisation i18n sécurisée sont opérationnels.",
        langLabel: "Choisir la langue:",
        cardTitle: "Intégrité du système vérifiée",
        cardText:
            "Les barrières locales de pré-commit (Lefthook, Biome, Ruff) et les workflows CI/CD cloud sont correctement configurés. L'espacement utilise des jetons sémantiques fluides.",
        buttonText: "Vérifier l'échelle d'espacement",
    },
    es: {
        title: "Fundamentos de PicoCards",
        description:
            "Su sistema de diseño monocromático de alto contraste y la localización i18n segura están completamente operativos.",
        langLabel: "Seleccionar idioma:",
        cardTitle: "Integridad del sistema verificada",
        cardText:
            "Tanto las puertas de enlace locales previas al commit (Lefthook, Biome, Ruff) como los flujos de trabajo de CI/CD en la nube están configurados correctamente. El espaciado utiliza tokens semánticos fluidos.",
        buttonText: "Verificar escala de espaciado",
    },
};
