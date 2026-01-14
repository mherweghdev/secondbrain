import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testTimeout: 30000, // 30s timeout for database operations
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    // 'scripts/**/*.{js,ts}', // Disabled coverage for scripts until stable
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/__tests__/**",
    "!src/app/**", // Exclude App Router files (UI/Actions) from unit test coverage
    "!src/components/ui/**", // Exclude UI components
    "!src/lib/supabase/middleware.ts", // Middleware logic tested via proxy.test.ts
  ],
  coverageThreshold: {
    global: {
      lines: 65,
      branches: 65,
      functions: 65,
      statements: 65,
    },
  },
  coverageDirectory: "coverage",
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/integration/", // Integration tests run separately with node environment
  ],
};

export default createJestConfig(config);
