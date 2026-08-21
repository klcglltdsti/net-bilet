import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import "../app/product.css";
import "../app/product-extra.css";
import "../app/panel.css";
import "../app/demo.css";
import "../app/readability.css";
import "../app/hybrid-theme.css";
import { App } from "./App";
import { installDemoApi } from "./demo-api";

installDemoApi();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
