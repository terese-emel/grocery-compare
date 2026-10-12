import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/real-stack",
  fullyParallel: false,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
