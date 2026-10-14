import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testIgnore: "**/real-stack/**",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "VITE_API_URL=http://127.0.0.1:3000 npm run dev -- --host 127.0.0.1 --port 4173",
    cwd: "../frontend",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
