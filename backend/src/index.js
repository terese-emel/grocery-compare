const mongoose = require("mongoose");
const app = require("./app");
const { getConfig } = require("./config");
const { closeAnalytics, initializeAnalytics } = require("./services/analyticsService");

let server;

async function start() {
  const config = getConfig();

  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  try {
    await initializeAnalytics();
    if (process.env.ANALYTICS_DATABASE_URL) {
      console.log("Connected to analytics database");
    }
  } catch (error) {
    console.warn("Analytics database unavailable:", error.message);
  }

  server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await mongoose.disconnect();
      await closeAnalytics();
      console.log("MongoDB disconnected.");
      process.exit(0);
    });
  } else {
    await mongoose.disconnect();
    await closeAnalytics();
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start().catch((error) => {
  console.error("Application startup failed:", error.message);
  process.exitCode = 1;
});
