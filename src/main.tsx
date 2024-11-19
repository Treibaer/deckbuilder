import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import setFavicon from "./utils/faviconSwitcher.ts";

setFavicon();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>
  // </StrictMode>
);
