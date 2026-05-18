import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Redireciona qualquer rota sem hash para /#/rota
if (!window.location.hash) {
  window.location.replace("/#" + window.location.pathname);
}
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GlobalLoadingProvider } from "@/contexts/GlobalLoadingContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalLoadingProvider>
      <ThemeProvider defaultTheme="light" switchable={false}>
        <App />
      </ThemeProvider>
    </GlobalLoadingProvider>
  </React.StrictMode>
);
