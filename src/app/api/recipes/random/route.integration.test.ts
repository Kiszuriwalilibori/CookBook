/**
 * @jest-environment node
 */

import { GET } from "./route";
import { client } from "@/utils/client";

jest.mock("@/utils/client", () => ({
    client: {
        fetch: jest.fn(),
    },
}));

jest.mock("next-sanity", () => ({
    groq: jest.fn((query: string) => query),
}));

describe("GET /api/recipes/random integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns recipes fetched from Sanity through route", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                slug: "test-recipe",
                imageUrl: "image.jpg",
                title: "Test recipe",
            },
        ]);

        const response = await GET(new Request("http://localhost/api/recipes/random?count=5"));

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toEqual({
            ok: true,
            data: [
                {
                    _id: "1",
                    slug: "test-recipe",
                    imageUrl: "image.jpg",
                    title: "Test recipe",
                },
            ],
        });

        expect(client.fetch).toHaveBeenCalledTimes(1);
    });

    it("returns empty data when Sanity returns no recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([]);

        const response = await GET(new Request("http://localhost/api/recipes/random?count=5"));

        const body = await response.json();

        expect(body).toEqual({
            ok: true,
            data: [],
        });
    });

    it("returns error response when Sanity fails", async () => {
        (client.fetch as jest.Mock).mockRejectedValue(new Error("Sanity unavailable"));

        const response = await GET(new Request("http://localhost/api/recipes/random?count=5"));

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toEqual({
            ok: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Nie udało się pobrać losowych przepisów",
            },
        });
    });
});
