import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Optional proxy: uncomment if you want /api calls to go to the backend
    // without needing CORS headers during development.
    // proxy: {
    //   '/api': { target: 'http://localhost:5550', changeOrigin: true },
    // },
  },
});
