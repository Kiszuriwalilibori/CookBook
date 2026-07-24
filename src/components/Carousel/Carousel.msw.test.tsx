/**
 * @jest-environment jsdom
 */

import "whatwg-fetch";

import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import Carousel from "./Carousel";

const mockHandleApiError = jest.fn();

const server = setupServer(
    rest.get("/api/recipes/random", (_req, res, ctx) => {
        return res(
            ctx.json({
                ok: true,
                data: [
                    {
                        _id: "1",
                        title: "MSW recipe",
                        slug: "msw-recipe",
                        imageUrl: "image.jpg",
                    },
                ],
            })
        );
    })
);

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: () => mockHandleApiError,
}));

jest.mock("react-multi-carousel", () => {
    function MockCarousel({ children }: { children: React.ReactNode }) {
        return <div data-testid="carousel-lib">{children}</div>;
    }

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
    LoadingIndicator: () => null,
}));

jest.mock("@/components/EmptyState", () => ({
    EmptyState: ({ title }: { title: string }) => <div data-testid="empty-state">{title}</div>,
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

beforeAll(() => {
    server.listen({
        onUnhandledRequest: "error",
    });
});

afterEach(() => {
    server.resetHandlers();
    mockHandleApiError.mockClear();
});

afterAll(() => {
    server.close();
});

describe("Carousel with MSW", () => {
    it("loads slides from API intercepted by MSW", async () => {
        render(<Carousel />);

        await waitFor(() => {
            expect(screen.getByTestId("carousel-item")).toBeInTheDocument();
        });
    });

    it("renders empty state when API returns no recipes", async () => {
        server.use(
            rest.get("/api/recipes/random", (_req, res, ctx) => {
                return res(
                    ctx.json({
                        ok: true,
                        data: [],
                    })
                );
            })
        );

        render(<Carousel />);

        await waitFor(() => {
            expect(screen.getByTestId("empty-state")).toHaveTextContent("Nie ma polecanych przepisów");
        });
    });
    it("requests default amount of slides", async () => {
        let receivedCount = "";

        server.use(
            rest.get("/api/recipes/random", (req, res, ctx) => {
                receivedCount = req.url.searchParams.get("count") ?? "";

                return res(
                    ctx.json({
                        ok: true,
                        data: [
                            {
                                _id: "1",
                                title: "Recipe",
                            },
                        ],
                    })
                );
            })
        );

        render(<Carousel />);

        await waitFor(() => {
            expect(screen.getByTestId("carousel-item")).toBeInTheDocument();
        });

        expect(receivedCount).toBe("5");
    });

    it("handles API error response", async () => {
        server.use(
            rest.get("/api/recipes/random", (_req, res, ctx) => {
                return res(
                    ctx.json({
                        ok: false,
                        error: {
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Server error",
                        },
                    })
                );
            })
        );

        render(<Carousel />);

        await waitFor(() => {
            expect(mockHandleApiError).toHaveBeenCalledWith({
                code: "INTERNAL_SERVER_ERROR",
                message: "Server error",
            });
        });
    });
});
