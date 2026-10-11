const mongoose = require("mongoose");
const app = require("./app");

const requiredVariables = [
  "MONGODB_USER",
  "MONGODB_PASSWORD",
  "MONGODB_HOST",
  "MONGODB_DATABASE",
];

async function start() {
  const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);
  }

  const username = encodeURIComponent(process.env.MONGODB_USER);
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
  const MONGODB_URI =
    `mongodb+srv://${username}:${password}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

start().catch((error) => {
  console.error("Application startup failed:", error.message);
  process.exitCode = 1;
});
