import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import "./index.css";

// Normaliza rotas sem hash → /#/rota antes de renderizar
if (!window.location.hash) {
  window.location.replace("/#" + window.location.pathname + window.location.search);
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <GlobalLoadingProvider>
        <ThemeProvider defaultTheme="light" switchable={false}>
          <App />
        </ThemeProvider>
      </GlobalLoadingProvider>
    </React.StrictMode>
  );
}
