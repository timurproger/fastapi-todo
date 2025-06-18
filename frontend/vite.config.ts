import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { proxyConfig } from "./proxyConfig";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
  },
});
