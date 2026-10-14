import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    env: {
      VITE_API_URL: "http://localhost:3000",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        branches: 55,
        functions: 45,
        lines: 55,
        statements: 55,
      },
    },
  },
});
