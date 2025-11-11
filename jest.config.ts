import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig: Config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Zmień na .ts, jeśli setup jest w TS
    testEnvironment: "jest-environment-jsdom", // Dla React/Next.js
    moduleNameMapper: {
        // Mapowanie dla aliasów Next.js (np. @/ -> src/)
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    // KLUCZOWE: Szukaj testów obok plików źródłowych (jak prosiłeś)
    testMatch: [
        "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}", // np. src/components/MyComponent.test.tsx
        "<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}",
    ],
    // Ignoruj foldery
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    // Pokrycie kodu
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    // Dla TS: Użyj ts-jest jako transformer (jeśli potrzeba)
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};

// Utwórz i wyeksportuj konfigurację
export default createJestConfig(customJestConfig);
