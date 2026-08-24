/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { useCarouselSlides } from "./useCarouselSlides";

const mockHandleApiError = jest.fn();

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: () => mockHandleApiError,
}));

describe("useCarouselSlides", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("does not fetch when initialSlides are provided", () => {
        global.fetch = jest.fn();

        const initialSlides = [
            {
                _id: "1",
                title: "Initial recipe",
            },
        ];

        const { result } = renderHook(() =>
            useCarouselSlides({
                count: 5,
                initialSlides,
            })
        );

        expect(global.fetch).not.toHaveBeenCalled();

        expect(result.current).toEqual({
            items: initialSlides,
            status: "success",
        });
    });

    it("sets empty status when API returns empty data", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: true,
                data: [],
            }),
        });

        const { result } = renderHook(() =>
            useCarouselSlides({
                count: 5,
                initialSlides: null,
            })
        );

        await waitFor(() => {
            expect(result.current.status).toBe("empty");
        });

        expect(result.current.items).toEqual([]);

        expect(global.fetch).toHaveBeenCalledWith("/api/recipes/random?count=5", {
            cache: "no-store",
        });
    });

    it("sets error status when API returns error", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                ok: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Server error",
                },
            }),
        });

        const { result } = renderHook(() =>
            useCarouselSlides({
                count: 5,
                initialSlides: null,
            })
        );

        await waitFor(() => {
            expect(result.current.status).toBe("error");
        });

        expect(result.current.items).toEqual([]);

        // expect(mockHandleApiError).toHaveBeenCalledWith({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: "Server error",
        // });

        expect(mockHandleApiError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "INTERNAL_SERVER_ERROR",
                message: "Server error",
            })
        );
    });

    it("does not update state after unmount during fetch", async () => {
        let resolveFetch!: (value: unknown) => void;

        global.fetch = jest.fn(
            () =>
                new Promise(resolve => {
                    resolveFetch = resolve;
                })
        ) as jest.Mock;
        const { unmount } = renderHook(() =>
            useCarouselSlides({
                count: 5,
                initialSlides: null,
            })
        );

        unmount();

        resolveFetch({
            json: jest.fn().mockResolvedValue({
                ok: true,
                data: [
                    {
                        _id: "1",
                        title: "Late recipe",
                    },
                ],
            }),
        });

        await Promise.resolve();

        expect(mockHandleApiError).not.toHaveBeenCalled();
    });
});
