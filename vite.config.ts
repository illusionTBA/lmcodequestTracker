import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import MillionLint from "@million/lint";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    MillionLint.vite(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
  },
});
