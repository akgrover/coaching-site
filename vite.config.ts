import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/coaching-site/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // Force pre-bundle framer-motion alongside react so a single React instance is used
    include: ["framer-motion", "react", "react-dom"],
    // Prevent Vite from scanning the parcel bundle.html which contains a duplicate copy
    exclude: [],
  },
  server: {
    fs: { deny: ["bundle.html"] },
  },
});
