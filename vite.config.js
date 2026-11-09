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
  server: {
    // Bind to all network interfaces so the dev server is reachable
    // from other devices on your local LAN (phones, tablets, etc.)
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    strictPort: true,
  },
});
