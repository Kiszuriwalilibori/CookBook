import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import RecipeRatingWidget from "./RecipeRatingWidget";

import { useApiResponseErrorHandler, useFingerprint } from "@/hooks";

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: jest.fn(),
    useFingerprint: jest.fn(),
}));

jest.mock("./getRatingText", () => ({
    getRatingsText: jest.fn((count: number) => (count === 1 ? "ocena" : "ocen")),
}));

jest.mock("react-rating-stars-component", () => {
    return function MockReactStars({ onChange, edit, value }: { onChange: (value: number) => void; edit: boolean; value: number }) {
        return (
            <button type="button" aria-label="Ocena" disabled={!edit} data-value={value} onClick={() => onChange(5)}>
                Stars
            </button>
        );
    };
});

describe("RecipeRatingWidget", () => {
    const mockHandleApiResponseError = jest.fn();
    const mockOnRatingUpdated = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        jest.clearAllMocks();

        (useFingerprint as jest.Mock).mockReturnValue("test-fingerprint");
        (useApiResponseErrorHandler as jest.Mock).mockReturnValue(mockHandleApiResponseError);

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders average rating and total ratings", () => {
        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4.5} totalRatings={12} />);

        expect(screen.getByText(/Średnia/)).toBeInTheDocument();
        expect(screen.getByText("4.5")).toBeInTheDocument();
        expect(screen.getByText(/\/ 5/)).toBeInTheDocument();
        expect(screen.getByText(/12/)).toBeInTheDocument();
        expect(screen.getByText(/ocen/)).toBeInTheDocument();
        expect(screen.getByText("Oceń")).toBeInTheDocument();
    });

    it("renders empty state when there are no ratings", () => {
        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={null} totalRatings={0} />);

        expect(screen.getByText("Brak ocen - bądź pierwszy!")).toBeInTheDocument();

        expect(screen.getByText("Oceń")).toBeInTheDocument();
    });

    it("submits a rating and shows success message", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    status: "updated",
                },
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} onRatingUpdated={mockOnRatingUpdated} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/recipe-ratings",
                expect.objectContaining({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recipeId: "recipe-1",
                        rating: 5,
                        fingerprint: "test-fingerprint",
                        overwrite: false,
                    }),
                })
            );
        });

        expect(mockOnRatingUpdated).toHaveBeenCalledTimes(1);

        expect(await screen.findByText("✓ Dziękuję za ocenę!")).toBeInTheDocument();
    });

    it("hides success message after 5 seconds", async () => {
        jest.useFakeTimers();

        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    status: "updated",
                },
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(screen.getByText("✓ Dziękuję za ocenę!")).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(4999);
        });

        expect(screen.getByText("✓ Dziękuję za ocenę!")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(screen.queryByText("✓ Dziękuję za ocenę!")).not.toBeInTheDocument();
    });

    it("shows noChange message and hides it after 5 seconds", async () => {
        jest.useFakeTimers();

        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    status: "noChange",
                },
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(screen.getByText("✓ Nie zmieniono oceny")).toBeInTheDocument();
        });

        act(() => {
            jest.advanceTimersByTime(4999);
        });

        expect(screen.getByText("✓ Nie zmieniono oceny")).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(screen.queryByText("✓ Nie zmieniono oceny")).not.toBeInTheDocument();
    });

    it("opens overwrite dialog when rating already exists", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    status: "exists",
                    existingRating: {
                        rating: 4,
                        updatedAt: "2026-08-20T12:00:00.000Z",
                    },
                },
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        expect(await screen.findByText("Już oceniałeś ten przepis")).toBeInTheDocument();

        expect(screen.getByText(/wystawiłeś 4⭐/)).toBeInTheDocument();

        expect(screen.getByText(/zmienić swoją ocenę na 5⭐/)).toBeInTheDocument();
    });

    it("closes overwrite dialog when user cancels", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    status: "exists",
                    existingRating: {
                        rating: 4,
                        updatedAt: "2026-08-20T12:00:00.000Z",
                    },
                },
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        expect(await screen.findByText("Już oceniałeś ten przepis")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Nie, zostaw starą ocenę",
            })
        );

        await waitFor(() => {
            expect(screen.queryByText("Już oceniałeś ten przepis")).not.toBeInTheDocument();
        });
    });

    it("submits overwrite rating after confirmation", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({
                    ok: true,
                    data: {
                        status: "exists",
                        existingRating: {
                            rating: 4,
                            updatedAt: "2026-08-20T12:00:00.000Z",
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    ok: true,
                    data: {
                        status: "updated",
                    },
                }),
            });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} onRatingUpdated={mockOnRatingUpdated} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        expect(await screen.findByText("Już oceniałeś ten przepis")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Tak, zmień ocenę",
            })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            "/api/recipe-ratings",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    recipeId: "recipe-1",
                    rating: 5,
                    fingerprint: "test-fingerprint",
                    overwrite: true,
                }),
            })
        );

        expect(mockOnRatingUpdated).toHaveBeenCalledTimes(1);

        expect(await screen.findByText("✓ Dziękuję za ocenę!")).toBeInTheDocument();
    });

    it("handles API error response", async () => {
        const error = {
            message: "Something went wrong",
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error,
            }),
        });

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(mockHandleApiResponseError).toHaveBeenCalledWith(error);
        });

        expect(screen.queryByText("✓ Dziękuję za ocenę!")).not.toBeInTheDocument();
    });

    it("handles fetch error", async () => {
        const error = new Error("Network error");

        (global.fetch as jest.Mock).mockRejectedValue(error);

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(mockHandleApiResponseError).toHaveBeenCalledWith(error);
        });
    });

    it("does not submit rating when fingerprint is unavailable", async () => {
        (useFingerprint as jest.Mock).mockReturnValue(null);

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("disables rating control while request is loading", async () => {
        let resolveFetch!: (value: unknown) => void;

        (global.fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveFetch = resolve;
            })
        );

        render(<RecipeRatingWidget recipeId="recipe-1" averageRating={4} totalRatings={10} />);

        fireEvent.click(screen.getByRole("button", { name: "Ocena" }));

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Ocena" })).toBeDisabled();
        });

        resolveFetch({
            json: async () => ({
                ok: true,
                data: {
                    status: "updated",
                },
            }),
        });

        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Ocena" })).not.toBeDisabled();
        });
    });
});
