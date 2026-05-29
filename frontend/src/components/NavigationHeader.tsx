import type { ReactNode } from "react";
import { type Language, useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../hooks/useTranslation";
import { locales } from "./NavigationHeader.locales";

type NavigationHeaderProps = {
    children?: ReactNode;
};

export function NavigationHeader({ children }: NavigationHeaderProps) {
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const t = useTranslation(locales);

    return (
        <header className="card-surface flex flex-col lg:flex-row justify-between items-center gap-space-sm">
            <span className="text-heading-lg">{t.title}</span>
            <div className="flex flex-col sm:flex-row items-center gap-space-md">
                {children}

                {/* Language Switcher */}
                <div className="flex items-center gap-space-sm">
                    <span className="text-body font-bold">{t.langSelect}</span>
                    <div className="flex gap-space-sm">
                        {(["en", "fr", "es"] as Language[]).map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setLanguage(lang)}
                                className={`btn-primary ${
                                    language === lang
                                        ? "ring-2 ring-offset-2 ring-[var(--text-primary)]"
                                        : "opacity-60"
                                }`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle Button */}
                <div className="flex items-center gap-space-sm">
                    <span className="text-body font-bold">{t.themeToggle}</span>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="btn-primary"
                    >
                        {theme === "dark" ? t.themeLight : t.themeDark}
                    </button>
                </div>
            </div>
        </header>
    );
}
