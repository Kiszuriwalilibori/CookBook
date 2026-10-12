/**
 * @jest-environment node
 */

jest.mock("next-sanity", () => ({
    createClient: jest.fn(() => ({
        fetch: (...args: unknown[]) => mockFetch(...args),
    })),
    groq: (strings: TemplateStringsArray, ...values: unknown[]) => strings.reduce((result, part, index) => result + part + (values[index] ?? ""), ""),
}));

const mockFetch = jest.fn();

import { GET } from "./route";
import { NextRequest } from "next/server";

type RouteContext = {
    params: Promise<{ field: string }>;
};

const createRequest = () => new NextRequest("http://localhost/api/uniques/test");

const createContext = (field: string): RouteContext => ({
    params: Promise.resolve({ field }),
});

describe("GET /api/uniques/[field]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.each([
        ["title", ".title"],
        ["cuisine", ".cuisine[]"],
        ["tags", ".tags[]"],
        ["dietary", ".dietary[]"],
        ["ingredients", ".ingredients[].name"],
        ["products", ".products[]"],
    ])("queries unique values for %s", async (field, expectedPath) => {
        mockFetch.mockResolvedValue(["Beta", "Alpha", ""]);

        const response = await GET(createRequest(), createContext(field));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(["Alpha", "Beta"]);

        expect(mockFetch).toHaveBeenCalledTimes(1);

        const query = mockFetch.mock.calls[0][0] as string;

        expect(query).toContain(expectedPath);
        expect(query).toContain("array::unique");
    });

    it("returns 400 for an unsupported field", async () => {
        const response = await GET(createRequest(), createContext("unknown"));

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({
            ok: false,
            error: {
                code: "INVALID_FIELD",
            },
        });

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns 400 when the field is empty", async () => {
        const response = await GET(createRequest(), createContext(""));

        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({
            ok: false,
            error: {
                code: "FIELD_REQUIRED",
            },
        });

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns 500 when Sanity query fails", async () => {
        mockFetch.mockRejectedValue(new Error("Sanity unavailable"));

        const response = await GET(createRequest(), createContext("cuisine"));

        expect(response.status).toBe(500);
        expect(await response.json()).toMatchObject({
            ok: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
            },
        });

        expect(console.error).toHaveBeenCalledWith("[API][uniques] Query failed:", expect.any(Error));
    });

    it("filters empty values and sorts results", async () => {
        mockFetch.mockResolvedValue(["Zupa", "", "   ", "Bigos", null, undefined]);

        const response = await GET(createRequest(), createContext("title"));

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(["   ", "Bigos", "Zupa"]);
    });
});
