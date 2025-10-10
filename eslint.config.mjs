import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended"),
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
        rules: {
            // Disable the base no-unused-vars rule to avoid conflicts
            "no-unused-vars": "off",
            // Enable TypeScript-specific no-unused-vars rule to catch unused imports and variables
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "none",
                    ignoreRestSiblings: false,
                    caughtErrors: "all",
                    // Optionally, allow unused imports with underscore prefix (e.g., _variable)
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
];

export default eslintConfig;
