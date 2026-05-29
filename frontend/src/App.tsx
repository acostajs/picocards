import { locales } from "./App.locales";
import { type Language, useLanguage } from "./context/LanguageContext";
import "./index.css";

export function App() {
    const { language, setLanguage } = useLanguage();
    const t = locales[language];

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <div className="layout-shell">
            {/* Header / Navigation Bar */}
            <header className="card-surface flex flex-col md:flex-row justify-between items-center gap-space-sm">
                <span className="text-heading-lg">{t.title}</span>
                <div className="flex items-center gap-space-sm">
                    <span className="text-body font-bold">{t.langLabel}</span>
                    <div className="flex gap-space-sm">
                        <button
                            type="button"
                            onClick={() => changeLanguage("en")}
                            className={`btn-primary ${language === "en" ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : "opacity-60"}`}
                        >
                            EN
                        </button>
                        <button
                            type="button"
                            onClick={() => changeLanguage("fr")}
                            className={`btn-primary ${language === "fr" ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : "opacity-60"}`}
                        >
                            FR
                        </button>
                        <button
                            type="button"
                            onClick={() => changeLanguage("es")}
                            className={`btn-primary ${language === "es" ? "ring-2 ring-offset-2 ring-[var(--text-primary)]" : "opacity-60"}`}
                        >
                            ES
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-space-lg text-center gap-space-md">
                <div className="max-w-2xl flex flex-col gap-space-md">
                    <h1 className="text-heading-lg text-4xl md:text-5xl tracking-normal normal-case">
                        {t.title}
                    </h1>
                    <p className="text-body text-lg">{t.description}</p>
                </div>

                {/* Demonstration Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md max-w-4xl mt-space-lg">
                    <section className="card-surface flex flex-col gap-space-sm text-left">
                        <h2 className="text-heading-md">{t.cardTitle}</h2>
                        <p className="text-body text-sm">{t.cardText}</p>
                    </section>

                    <section className="card-surface flex flex-col justify-between items-start gap-space-md text-left">
                        <div className="flex flex-col gap-space-sm">
                            <h2 className="text-heading-md">
                                Design Tokens & Themes
                            </h2>
                            <p className="text-body text-sm">
                                Responds dynamically to system light and dark
                                color preferences natively. Spacing uses
                                semantic variables strictly.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="btn-primary w-full md:w-auto"
                        >
                            {t.buttonText}
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;
