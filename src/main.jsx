import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";
import { SOARProvider } from "./hooks/useSOARState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SOARProvider>
      <App />
    </SOARProvider>
  </StrictMode>,
);
