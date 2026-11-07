import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/Components"),
      "@/Components": path.resolve(__dirname, "./src/Components"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
