import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
      plugins: [react()],
      server: {
            proxy: {
                  "/tmdb": {
                        target: "https://image.tmdb.org",
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/tmdb/, ""),
                  },
            },
      },
});
