import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Resources } from "./screens/Resources";
import "./styles/responsive-grid.css";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Resources />
  </StrictMode>,
);
