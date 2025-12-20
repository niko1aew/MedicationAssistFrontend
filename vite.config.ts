import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  server: {
    https: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5018",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Disable source maps in production
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          mobx: ["mobx", "mobx-react-lite"],
        },
      },
    },
  },
});
