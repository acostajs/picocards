export type HomepageTranslations = {
    title: string;
    tagline: string;
    description: string;
    ctaRegister: string;
    ctaLogin: string;
    langSelect: string;
    featuresTitle: string;
    feat1Title: string;
    feat1Text: string;
    feat2Title: string;
    feat2Text: string;
    feat3Title: string;
    feat3Text: string;
};

export const locales: Record<"en" | "fr" | "es", HomepageTranslations> = {
    en: {
        title: "PicoCards",
        tagline: "Ultra-Fast, Zero-Friction Study Cards",
        description:
            "Organize your course materials, practice with interactive decks, and study with peers. Built exclusively to boost academic confidence and ease student cognitive load.",
        ctaRegister: "Register on Hub.ca",
        ctaLogin: "Access Workspace",
        langSelect: "Select Language:",
        featuresTitle: "Why PicoCards?",
        feat1Title: "Frictionless SSO",
        feat1Text:
            "One account. Instant, secure access via shared root-domain cookies without logging in twice.",
        feat2Title: "Minimalist Focus",
        feat2Text:
            "Pure high-contrast layout designed strictly to minimize distraction and maximize recall speed.",
        feat3Title: "Real-time Collaboration",
        feat3Text:
            "Invite classmates instantly via email to co-edit and master course decks together.",
    },
    fr: {
        title: "PicoCards",
        tagline: "Cartes d'étude ultra-rapides et sans friction",
        description:
            "Organisez vos cours, révisez avec des decks interactifs et collaborez. Conçu pour stimuler la confiance académique et alléger la charge mentale des étudiants.",
        ctaRegister: "S'inscrire sur Hub.ca",
        ctaLogin: "Accéder à l'espace",
        langSelect: "Choisir la langue:",
        featuresTitle: "Pourquoi PicoCards?",
        feat1Title: "SSO sans friction",
        feat1Text:
            "Un seul compte. Accès instantané et sécurisé via des cookies de domaine partagés.",
        feat2Title: "Focus Minimaliste",
        feat2Text:
            "Mise en page épurée à fort contraste conçue pour éliminer les distractions et optimiser la mémoire.",
        feat3Title: "Collaboration en Temps Réel",
        feat3Text:
            "Invitez instantanément vos camarades par e-mail pour éditer et maîtriser les cours ensemble.",
    },
    es: {
        title: "PicoCards",
        tagline: "Tarjetas de estudio ultra rápidas y sin fricciones",
        description:
            "Organiza tus materias, practica con mazos interactivos y estudia con tus compañeros. Creado para aumentar la confianza académica y reducir la fatiga mental.",
        ctaRegister: "Registrarse en Hub.ca",
        ctaLogin: "Acceder al espacio",
        langSelect: "Seleccionar idioma:",
        featuresTitle: "¿Por qué PicoCards?",
        feat1Title: "SSO sin fricciones",
        feat1Text:
            "Una sola cuenta. Acceso inmediato y seguro mediante cookies de dominio compartido.",
        feat2Title: "Enfoque Minimalista",
        feat2Text:
            "Diseño limpio de alto contraste ideado para reducir distracciones y acelerar el aprendizaje.",
        feat3Title: "Colaboración en Tiempo Real",
        feat3Text:
            "Invita a tus compañeros por correo para coeditar y dominar juntos las materias del curso.",
    },
};
