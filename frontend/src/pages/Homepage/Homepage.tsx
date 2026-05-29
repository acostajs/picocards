import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Language, useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { locales } from "./Homepage.locales";

function getCookie(name: string): string | null {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (const cookie of cookies) {
        const parts = cookie.split("=");
        const key = parts[0];
        const value = parts[1];
        if (key === name && value !== undefined) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

export function Homepage() {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    let t = locales.en;
    switch (language) {
        case "en":
            t = locales.en;
            break;
        case "fr":
            t = locales.fr;
            break;
        case "es":
            t = locales.es;
            break;
        default: {
            const _exhaustiveCheck: never = language;
            t = locales.en;
        }
    }

    useEffect(() => {
        const session = getCookie("hub_session");
        if (session) {
            navigate("/dashboard");
        }
    }, [navigate]);

    return (
        <div className="layout-shell">
            {/* Header */}
            <header className="card-surface flex flex-col lg:flex-row justify-between items-center gap-space-sm">
                <span className="text-heading-lg">{t.title}</span>
                <div className="flex flex-col sm:flex-row items-center gap-space-md">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-space-sm">
                        <span className="text-body font-bold">
                            {t.langSelect}
                        </span>
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
                        <span className="text-body font-bold">
                            {t.themeToggle}:
                        </span>
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

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-space-md">
                <div className="max-w-2xl flex flex-col gap-space-md">
                    <h1 className="text-heading-lg text-4xl md:text-5xl tracking-normal normal-case">
                        {t.tagline}
                    </h1>
                    <p className="text-body text-lg max-w-xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-space-sm mt-space-md">
                    <a
                        href="https://hub.ca/register"
                        className="btn-primary no-underline text-center inline-block"
                    >
                        {t.ctaRegister}
                    </a>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="btn-primary bg-transparent text-[var(--text-primary)]"
                    >
                        {t.ctaLogin}
                    </button>
                </div>

                {/* Value Propositions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md max-w-5xl mt-space-lg w-full">
                    <section className="card-surface flex flex-col gap-space-sm text-left">
                        <h2 className="text-heading-md">{t.feat1Title}</h2>
                        <p className="text-body text-sm">{t.feat1Text}</p>
                    </section>

                    <section className="card-surface flex flex-col gap-space-sm text-left">
                        <h2 className="text-heading-md">{t.feat2Title}</h2>
                        <p className="text-body text-sm">{t.feat2Text}</p>
                    </section>

                    <section className="card-surface flex flex-col gap-space-sm text-left">
                        <h2 className="text-heading-md">{t.feat3Title}</h2>
                        <p className="text-body text-sm">{t.feat3Text}</p>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Homepage;
