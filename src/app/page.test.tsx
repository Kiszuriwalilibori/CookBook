import { render, screen } from "@testing-library/react";

import Page from "./page";
import getRandomRecipes from "@/utils/getRandomRecipes";

jest.mock("@/utils/getRandomRecipes", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockSlider = jest.fn();

jest.mock("@/components/Slider/Slider", () => {
    function MockSlider(props: unknown) {
        mockSlider(props);

        return <div data-testid="slider" />;
    }

    MockSlider.displayName = "MockSlider";

    return MockSlider;
});

jest.mock("@/components", () => ({
    LatestRecipesSection: () => <div data-testid="latest-recipes" />,
    TopRatedRecipesSection: () => <div data-testid="top-rated-recipes" />,
    LoadingIndicator: () => <div data-testid="loading-indicator" />,
}));

describe("Home page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("passes fetched slides to Slider", async () => {
        const slides = [
            {
                _id: "1",
                title: "Pizza",
                slug: "pizza",
                imageUrl: "pizza.jpg",
            },
        ];

        (getRandomRecipes as jest.Mock).mockResolvedValue({
            ok: true,
            data: slides,
        });

        render(await Page());

        expect(screen.getByTestId("slider")).toBeInTheDocument();

        expect(mockSlider).toHaveBeenCalledWith({
            initialSlides: slides,
            error: null,
        });
    });

    it("passes error to Slider when fetching fails", async () => {
        (getRandomRecipes as jest.Mock).mockResolvedValue({
            ok: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Server error",
            },
        });

        render(await Page());

        expect(mockSlider).toHaveBeenCalledWith({
            initialSlides: [],
            error: "Server error",
        });
    });
});
