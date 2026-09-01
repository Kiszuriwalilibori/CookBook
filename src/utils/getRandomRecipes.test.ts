jest.mock("next-sanity", () => ({
    groq: jest.fn(),
}));

jest.mock("./client", () => ({
    client: {
        fetch: jest.fn(),
    },
}));

jest.mock("../lib/sanity/imageUrl", () => ({
    urlFor: jest.fn(() => ({
        width: jest.fn(() => ({
            height: jest.fn(() => ({
                quality: jest.fn(() => ({
                    auto: jest.fn(() => ({
                        url: jest.fn(() => "image.jpg"),
                    })),
                })),
            })),
        })),
    })),
}));

import { client } from "./client";
import getRandomRecipes from "./getRandomRecipes";

describe("getRandomRecipes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns successful ApiResponse with recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                slug: "test-recipe",
                image: {
                    _type: "image",
                    asset: {
                        _ref: "image-test",
                    },
                },
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

    it("generates imageUrl from Sanity image", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                slug: "test-recipe",
                image: {
                    _type: "image",
                    asset: {
                        _ref: "image-test",
                    },
                },
                title: "With image",
            },
        ]);

        const result = await getRandomRecipes(1);

        expect(result.ok).toBe(true);

        if (result.ok) {
            expect(result.data[0].imageUrl).toBe("image.jpg");
        }
    });

    it("limits number of recipes", async () => {
        (client.fetch as jest.Mock).mockResolvedValue([
            {
                _id: "1",
                slug: "recipe-1",
                image: {
                    _type: "image",
                    asset: { _ref: "image-1" },
                },
            },
            {
                _id: "2",
                slug: "recipe-2",
                image: {
                    _type: "image",
                    asset: { _ref: "image-2" },
                },
            },
            {
                _id: "3",
                slug: "recipe-3",
                image: {
                    _type: "image",
                    asset: { _ref: "image-3" },
                },
            },
        ]);

        const result = await getRandomRecipes(2);

        expect(result.ok).toBe(true);

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
