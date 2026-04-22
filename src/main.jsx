import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";
import { SOARProvider } from "./hooks/useSOARState";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SOARProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SOARProvider>
  </StrictMode>,
);
