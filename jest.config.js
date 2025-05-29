// jest.config.js
const nextJest = require("next/jest");

// Load Next.js config
const createJestConfig = nextJest({ dir: "./" });

// Custom Jest config
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
