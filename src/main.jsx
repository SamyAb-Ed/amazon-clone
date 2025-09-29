import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./Components/DataProvider/DataProvider.jsx";

console.log("🚀 Loading Amazon Clone...");

try {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <StrictMode>
      <DataProvider>
        <App />
      </DataProvider>
    </StrictMode>
  );
  console.log("✅ Amazon Clone loaded successfully!");
} catch (error) {
  console.error("❌ Error loading Amazon Clone:", error);
}
