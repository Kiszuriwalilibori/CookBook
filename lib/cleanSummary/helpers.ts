import { Options } from "@/types";

export const CLEAN_SUMMARY_MESSAGES = {
    NOT_AN_OBJECT: (type: string) => `Expected an object of type Options but got ${type}`,
    UNEXPECTED_FIELD: (key: string) => `Unexpected field: ${key}`,
    MISSING_FIELD: (key: string) => `Missing field: ${key}`,
    NOT_ARRAY_FIELD: (key: string, type: string) => `Field "${key}" should be an array but got ${type}`,
    REMOVED_FAULTY_VALUE: (value: unknown) => `Removed faulty array value: ${String(value)}`,
};

// 🟩 Base empty structure
export const initialSummary: Options = {
    titles: [],
    cuisines: [],
    tags: [],
    dietaryRestrictions: [],
    products: [],
};
