import { act, render, screen, waitFor } from "@testing-library/react";

import Carousel, { DELAY } from "./Carousel";

const mockHandleApiError = jest.fn();

const mockCarouselLib = jest.fn(({ children }) => <div data-testid="carousel-lib">{children}</div>);

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: () => mockHandleApiError,
}));

jest.mock("react-multi-carousel", () => {
    const MockCarousel = (props: { children: React.ReactNode }) => {
        mockCarouselLib(props);

        return <div data-testid="carousel-lib">{props.children}</div>;
    };

    MockCarousel.displayName = "MockCarousel";

    return MockCarousel;
});

jest.mock("./Carousel.item", () => {
    function MockCarouselItem() {
        return <div data-testid="carousel-item" />;
    }

    MockCarouselItem.displayName = "MockCarouselItem";

    return MockCarouselItem;
});

jest.mock("@/components", () => ({
    LoadingIndicator: ({ prompt }: { prompt: string }) => <div data-testid="loading">{prompt}</div>,
}));

jest.mock("@/components/EmptyState", () => ({
    EmptyState: ({ title }: { title: string }) => <div data-testid="empty-state">{title}</div>,
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("Carousel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders carousel with initial slides", () => {
        const slides = [
            {
                _id: "1",
                title: "Recipe 1",
                slug: "recipe-1",
                imageUrl: "image.jpg",
            },
        ];

        render(<Carousel initialSlides={slides} />);

        expect(screen.getByTestId("carousel-lib")).toBeInTheDocument();

        expect(screen.getByTestId("carousel-item")).toBeInTheDocument();
    });

    it("shows loading indicator after delay", async () => {
        jest.useFakeTimers();

        global.fetch = jest.fn(
            () =>
                new Promise(() => {
                    // fetch nigdy się nie kończy
                })
        );

        render(<Carousel />);

        act(() => {
            jest.advanceTimersByTime(DELAY);
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("Ładowanie przepisów...");

        jest.useRealTimers();
    });
    it("handles invalid JSON response", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
        });

        render(<Carousel />);

        await waitFor(() => {
            expect(mockHandleApiError).toHaveBeenCalledWith({
                type: "PARSE_ERROR",
                message: "Invalid JSON response",
            });
        });
    });
    it("does not show loading indicator before delay", () => {
        jest.useFakeTimers();

        render(<Carousel />);

        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(DELAY - 1);
        });

        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();

        jest.useRealTimers();
    });
    it("shows empty state when there are no slides", () => {
        render(<Carousel initialSlides={[]} />);

        expect(screen.getByTestId("empty-state")).toHaveTextContent("Nie ma polecanych przepisów");
    });

    it("fetches slides when initialSlides are missing", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: true,
                data: [
                    {
                        _id: "1",
                        title: "Fetched recipe",
                        slug: "recipe",
                        imageUrl: "image.jpg",
                    },
                ],
            }),
        });

        render(<Carousel />);

        await waitFor(() => {
            expect(screen.getByTestId("carousel-item")).toBeInTheDocument();
        });

        expect(fetch).toHaveBeenCalledWith("/api/recipes/random?count=5", {
            cache: "no-store",
        });
    });

    it("handles API error response", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Server error",
                },
            }),
        });

        render(<Carousel />);

        await waitFor(() => {
            expect(mockHandleApiError).toHaveBeenCalledWith({
                code: "INTERNAL_SERVER_ERROR",
                message: "Server error",
            });
        });
    });
});
