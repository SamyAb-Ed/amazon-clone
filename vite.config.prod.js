import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/amazon-clone/", // Use base path for GitHub Pages deployment
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth", "firebase/firestore"],
  },
  define: {
    // Ensure proper base path handling
    __BASE_PATH__: '"/amazon-clone/"',
  },
});
