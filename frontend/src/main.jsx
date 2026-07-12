import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ── Bootstrap ──────────────────────────────────────────────────────────────────
// CSS must load before our custom styles so our overrides take effect.
import "bootstrap/dist/css/bootstrap.min.css";
// JS bundle includes Popper.js — required for modals, dropdowns, and accordions.
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ── Custom styles ──────────────────────────────────────────────────────────────
// Load after Bootstrap so our CSS variables and class overrides win.
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
