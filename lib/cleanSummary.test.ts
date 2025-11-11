import { cleanSummary, CLEAN_SUMMARY_MESSAGES } from "./cleanSummary";
import type { Options } from "@/types";

describe("cleanSummary", () => {
    const validInput: Options = {
        titles: ["Recipe 1"],
        cuisines: ["Italian"],
        tags: ["Quick"],
        dietaryRestrictions: ["Vegan"],
        products: ["Tomato"],
    };

    test("1️⃣ detects when a non-object is passed", () => {
        const result = cleanSummary(null);
        expect(result.sanitizedSummary).toEqual({
            titles: [],
            cuisines: [],
            tags: [],
            dietaryRestrictions: [],
            products: [],
        });
        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.NOT_AN_OBJECT("object"));
    });

    test("2️⃣ detects extra fields beyond Options", () => {
        const input = {
            ...validInput,
            extraField: ["oops"],
        } as unknown as Options;

        const result = cleanSummary(input);

        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.UNEXPECTED_FIELD("extraField"));
    });

    test("3️⃣ detects missing fields", () => {
        const input = {
            titles: ["Only titles"],
        } as Partial<Options>;

        const result = cleanSummary(input);

        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("cuisines"));
        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.MISSING_FIELD("tags"));
    });

    test("4️⃣ ensures all key values are arrays and records faults", () => {
        const input = {
            titles: ["Valid"],
            cuisines: "Not an array" as unknown as string[],
            tags: ["Okay"],
            dietaryRestrictions: null as unknown as string[],
            products: ["Fine"],
        } as unknown as Options;

        const result = cleanSummary(input);

        expect(result.sanitizedSummary.cuisines).toEqual([]);
        expect(result.sanitizedSummary.dietaryRestrictions).toEqual([]);

        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("cuisines", "string"));
        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.NOT_ARRAY_FIELD("dietaryRestrictions", "object"));
    });

    test("5️⃣ removes faulty array values", () => {
        const input = {
            ...validInput,
            titles: ["Good", "", null as unknown as string],
        };

        const result = cleanSummary(input);

        expect(result.sanitizedSummary.titles).toEqual(["Good"]);
        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(""));
        expect(result.faulty).toContain(CLEAN_SUMMARY_MESSAGES.REMOVED_FAULTY_VALUE(null));
    });
});
