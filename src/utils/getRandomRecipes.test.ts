jest.mock("next-sanity", () => ({
    groq: jest.fn(),
}));

import { client } from "./client";
import getRandomRecipes from "./getRandomRecipes";

jest.mock("./client", () => ({
    client: {
        fetch: jest.fn(),
    },
}));

describe("getRandomRecipes", () => {
    it("returns successful ApiResponse with recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                slug: "test-recipe",
                imageUrl: "image.jpg",
                title: "Test recipe",
            },
        ]);

        const result = await getRandomRecipes(5);

        expect(result.ok).toBe(true);

        if (result.ok) {
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toEqual({
                _id: "1",
                slug: "test-recipe",
                imageUrl: "image.jpg",
                title: "Test recipe",
            });
        }
    });

    it("returns error ApiResponse when Sanity fails", async () => {
        (client.fetch as jest.Mock).mockRejectedValue(new Error("Sanity error"));

        const result = await getRandomRecipes(5);

        expect(result.ok).toBe(false);

        if (!result.ok) {
            expect(result.error).toEqual({
                code: "INTERNAL_SERVER_ERROR",
                message: "Nie udało się pobrać losowych przepisów",
            });
        }
    });

    it("returns empty data when there are no recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([]);

        const result = await getRandomRecipes(5);

        expect(result).toEqual({
            ok: true,
            data: [],
        });
    });
});
