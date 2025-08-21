import React from "react";
import ReactDOM from "react-dom/client";
// No longer needed - using direct Stack Auth client calls
import App from "./App.tsx";
import "./index.css";
import "@/utils/i18n";
import "react-i18next";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
