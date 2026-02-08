import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  server: {
    allowedHosts: [
      "96c5d3a8-9e8e-419a-b756-29ba0fd3edc9-00-1yr1syq1r2oh.sisko.replit.dev"
    ],
  },
});
