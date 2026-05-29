import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationHeader } from "../../components/NavigationHeader";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { locales } from "./Homepage.locales";

export function Homepage() {
    const navigate = useNavigate();
    const t = useTranslation(locales);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="layout-shell">
            {/* Header */}
            <NavigationHeader />

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
