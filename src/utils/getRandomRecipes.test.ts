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
    it("prefers recipes with images", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                imageUrl: null,
                title: "No image",
            },
            {
                _id: "2",
                imageUrl: "image.jpg",
                title: "With image",
            },
        ]);

        const result = await getRandomRecipes(1);

        if (result.ok) {
            expect(result.data[0]._id).toBe("2");
        }
    });
    it("limits number of recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([{ _id: "1" }, { _id: "2" }, { _id: "3" }]);

        const result = await getRandomRecipes(2);

        if (result.ok) {
            expect(result.data).toHaveLength(2);
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
