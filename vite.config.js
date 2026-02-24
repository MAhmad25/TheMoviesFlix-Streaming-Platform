import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
      plugins: [react()],
      server: {
            proxy: {
                  "/tmdb-img": {
                        target: "https://image.tmdb.org/t/p",
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/tmdb-img/, ""),
                  },
            },
      },
});
