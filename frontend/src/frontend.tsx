/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { LanguageProvider } from "./context/LanguageContext";

const elem = document.getElementById("root");
if (!elem) {
    throw new Error("Root element not found");
}
const app = (
    <StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
let root = import.meta.hot.data.root;
if (!root) {
    root = createRoot(elem);
    import.meta.hot.data.root = root;
}
root.render(app);
