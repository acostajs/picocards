/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

const elem = document.getElementById("root");
if (!elem) {
    throw new Error("Root element not found");
}
const app = (
    <StrictMode>
        <LanguageProvider>
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        </LanguageProvider>
    </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const isHot = typeof import.meta.hot !== "undefined";
let root: unknown = isHot
    ? (
          import.meta as unknown as {
              hot: { data: { root: unknown } };
          }
      ).hot.data.root
    : null;
if (!root) {
    root = createRoot(elem);
    if (isHot) {
        (
            import.meta as unknown as {
                hot: { data: { root: unknown } };
            }
        ).hot.data.root = root;
    }
}
(root as Root).render(app);
