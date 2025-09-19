// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // https://vite.dev/config/

// export default defineConfig({
//   plugins: [react()],
//   base: "/Amazon-clone/",
// });



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig({
  plugins: [react()],
  base: "/Amazon-clone/",
  build: {
  outDir: "dist",
  },
});