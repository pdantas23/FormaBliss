import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import "./index.css";

// Normaliza URL sem hash → /#/rota sem disparar page reload
if (!window.location.hash) {
  window.location.hash = window.location.pathname === "/"
    ? "/"
    : window.location.pathname;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalLoadingProvider>
      <ThemeProvider defaultTheme="light" switchable={false}>
        <App />
      </ThemeProvider>
    </GlobalLoadingProvider>
  </React.StrictMode>
);
