import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

export type Language = "en" | "fr" | "es";

export type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const systemLang = navigator.language.slice(0, 2);
        if (systemLang === "fr") {
            setLanguage("fr");
        } else if (systemLang === "es") {
            setLanguage("es");
        } else {
            setLanguage("en");
        }
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
