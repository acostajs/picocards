import { useLanguage } from "../context/LanguageContext";

export function useTranslation<T>(
    pageLocales: Record<"en" | "fr" | "es", T>,
): T {
    const { language } = useLanguage();

    switch (language) {
        case "en":
            return pageLocales.en;
        case "fr":
            return pageLocales.fr;
        case "es":
            return pageLocales.es;
        default: {
            const _exhaustiveCheck: never = language;
            return pageLocales.en;
        }
    }
}

export default useTranslation;
