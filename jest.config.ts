import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./", // Root: CookBook/
});

const customJestConfig: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        // Opcjonalnie: Alias dla src/ (jeśli masz w tsconfig.json)
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    // KLUCZOWE: Szukaj w lib/ I src/
    testMatch: [
        "<rootDir>/lib/**/*.test.{js,jsx,ts,tsx}",
        "<rootDir>/lib/**/*.spec.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}", // NOWOŚĆ: src/
        "<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}",
    ],
    // Ignoruj node_modules, .next i studio
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/studio/node_modules/"],
    collectCoverageFrom: [
        "lib/**/*.{js,jsx,ts,tsx}",
        "src/**/*.{js,jsx,ts,tsx}", // NOWOŚĆ: Pokrycie też z src/
        "!lib/**/*.d.ts",
        "!src/**/*.d.ts",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};

export default createJestConfig(customJestConfig);
