import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    allowedHosts: true,
    96c5d3a8-9e8e-419a-b756-29ba0fd3edc9-00-1yr1syq1r2oh.sisko.replit.dev
  },
});
