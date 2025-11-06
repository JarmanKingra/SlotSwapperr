import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { AuthProvider } from "./context/authContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { EventProvider } from "./context/eventContext.jsx";
import { SwapProvider } from "./context/swapContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <SwapProvider>
            <App />
          </SwapProvider>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
