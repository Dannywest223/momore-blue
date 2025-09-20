import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["socket.io-client"], // <-- pre-bundle socket.io-client for dev
  },
  build: {
    rollupOptions: {
      // Do NOT externalize socket.io-client; let Vite bundle it
      // external: ["socket.io-client"], <-- remove this
    },
  },
}));
