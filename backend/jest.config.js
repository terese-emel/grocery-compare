module.exports = {
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
  ],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 70,
      lines: 78,
      statements: 80,
    },
  },
};
