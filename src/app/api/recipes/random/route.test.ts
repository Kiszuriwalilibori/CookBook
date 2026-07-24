/**
 * @jest-environment node
 */

import { GET } from "./route";
import getRandomRecipes from "@/utils/getRandomRecipes";
import { NextRequest } from "next/server";

jest.mock("@/utils/getRandomRecipes", () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("GET /api/recipes/random", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns recipes response from getRandomRecipes", async () => {
        const apiResponse = {
            ok: true,
            data: [
                {
                    _id: "1",
                    title: "Pizza",
                    slug: "pizza",
                    imageUrl: "image.jpg",
                },
            ],
        };

        (getRandomRecipes as jest.Mock).mockResolvedValue(apiResponse);

        const request = new NextRequest("http://localhost/api/recipes/random?count=5");

        const response = await GET(request);

        expect(response.status).toBe(200);

        expect(await response.json()).toEqual(apiResponse);

        expect(getRandomRecipes).toHaveBeenCalledWith(5);
    });

    it("uses default count when count parameter is missing", async () => {
        (getRandomRecipes as jest.Mock).mockResolvedValue({
            ok: true,
            data: [],
        });

        await GET(new NextRequest("http://localhost/api/recipes/random"));

        expect(getRandomRecipes).toHaveBeenCalledWith(5);
    });

    it("limits count to maximum 20", async () => {
        (getRandomRecipes as jest.Mock).mockResolvedValue({
            ok: true,
            data: [],
        });

        await GET(new NextRequest("http://localhost/api/recipes/random?count=100"));

        expect(getRandomRecipes).toHaveBeenCalledWith(20);
    });

    it("limits count to minimum 1", async () => {
        (getRandomRecipes as jest.Mock).mockResolvedValue({
            ok: true,
            data: [],
        });

        await GET(new NextRequest("http://localhost/api/recipes/random?count=0"));

        expect(getRandomRecipes).toHaveBeenCalledWith(1);
    });

    it("returns error response when getRandomRecipes throws", async () => {
        (getRandomRecipes as jest.Mock).mockRejectedValue(new Error("Database error"));

        const response = await GET(new NextRequest("http://localhost/api/recipes/random"));

        expect(response.status).toBeGreaterThanOrEqual(400);

        const body = await response.json();

        expect(body.ok).toBe(false);
    });
});
