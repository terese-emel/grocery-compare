const requiredEnvironmentVariables = [
  "MONGODB_USER",
  "MONGODB_PASSWORD",
  "MONGODB_HOST",
  "MONGODB_DATABASE",
];

function getConfig() {
  const missingVariables = requiredEnvironmentVariables.filter(
    (variable) => !process.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`,
    );
  }

  const username = encodeURIComponent(process.env.MONGODB_USER);
  const password = encodeURIComponent(process.env.MONGODB_PASSWORD);

  return {
    port: Number(process.env.PORT || 3000),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    mongoUri: `mongodb+srv://${username}:${password}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`,
  };
}

module.exports = { getConfig };
