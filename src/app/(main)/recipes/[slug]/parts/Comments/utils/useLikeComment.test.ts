import { act, renderHook, waitFor } from "@testing-library/react";

import { useLikeComment } from "./useLikeComment";

import { useApiResponseErrorHandler } from "@/hooks";
// Hook zwraca początkową listę polubień i prawidłowo określa, czy komentarz został już polubiony przez użytkownika.
// Hook rozpoznaje, że użytkownik już polubił komentarz, gdy jego fingerprint znajduje się na liście polubień.
// Hook optymistycznie dodaje polubienie i wysyła poprawny request PATCH do API.
// Hook przyjmuje listę polubień zwróconą przez API jako końcowy stan.
// Hook optymistycznie usuwa polubienie, gdy użytkownik wcześniej polubił komentarz.
// Przy dodawaniu polubienia uruchamiana jest wibracja oraz animacja.
// Przy usuwaniu polubienia wibracja i animacja nie są uruchamiane.
// Hook nie wykonuje operacji, gdy fingerprint użytkownika jest pusty.
// W przypadku błędu API optymistyczna zmiana zostaje wycofana, a błąd przekazany do handlera.
// Błąd INVALID_INPUT jest prawidłowo przekazywany do handlera jako ostrzeżenie.
// Błąd INTERNAL_ERROR jest prawidłowo przekazywany do handlera jako błąd.
// Podczas oczekiwania na odpowiedź API mutacja jest oznaczona jako trwająca, a zmiana optymistyczna jest już widoczna.
// Podczas trwającej mutacji hook nie rozpoczyna kolejnej operacji.
// Publiczna metoda setLikes pozwala ręcznie zmienić listę polubień.
// Polubienie zostaje optymistycznie dodane jeszcze przed otrzymaniem odpowiedzi API.
// Polubienie zostaje optymistycznie usunięte jeszcze przed otrzymaniem odpowiedzi API.

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: jest.fn(),
}));

describe("useLikeComment", () => {
    const commentId = "comment-1";
    const fingerprint = "fingerprint-1";

    const mockHandleApiResponseError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useApiResponseErrorHandler as jest.Mock).mockReturnValue(mockHandleApiResponseError);

        Object.defineProperty(navigator, "vibrate", {
            configurable: true,
            value: jest.fn(),
        });

        global.fetch = jest.fn();
    });

    it("returns initial likes and correct alreadyLiked state", () => {
        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: ["fingerprint-2"],
            })
        );

        expect(result.current.likes).toEqual(["fingerprint-2"]);
        expect(result.current.alreadyLiked).toBe(false);
        expect(result.current.isLiking).toBe(false);
    });

    it("sets alreadyLiked to true when fingerprint is already in likes", () => {
        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [fingerprint],
            })
        );

        expect(result.current.likes).toEqual([fingerprint]);
        expect(result.current.alreadyLiked).toBe(true);
    });

    it("optimistically adds fingerprint and sends HANDLE_LIKE request", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    likes: [fingerprint],
                },
            }),
        });

        const onLikeAnimation = jest.fn();

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
                onLikeAnimation,
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(result.current.likes).toEqual([fingerprint]);
        expect(result.current.alreadyLiked).toBe(true);

        expect(fetch).toHaveBeenCalledWith("/api/comments", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId,
                fingerprint,
                option: "HANDLE_LIKE",
            }),
        });
    });

    it("uses likes returned by the API as the final state", async () => {
        const serverLikes = [fingerprint, "fingerprint-2"];

        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    likes: serverLikes,
                },
            }),
        });

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(result.current.likes).toEqual(serverLikes);
    });

    it("optimistically removes fingerprint when the comment is already liked", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    likes: ["fingerprint-2"],
                },
            }),
        });

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [fingerprint, "fingerprint-2"],
            })
        );

        expect(result.current.alreadyLiked).toBe(true);

        await act(async () => {
            await result.current.handleLike();
        });

        expect(result.current.likes).toEqual(["fingerprint-2"]);

        expect(fetch).toHaveBeenCalledWith("/api/comments", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId,
                fingerprint,
                option: "HANDLE_LIKE",
            }),
        });
    });

    it("triggers vibration and like animation only when adding a like", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    likes: [fingerprint],
                },
            }),
        });

        const onLikeAnimation = jest.fn();
        const vibrate = navigator.vibrate as jest.Mock;

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
                onLikeAnimation,
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(vibrate).toHaveBeenCalledWith(10);
        expect(onLikeAnimation).toHaveBeenCalledTimes(1);
    });

    it("does not trigger vibration or animation when removing a like", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    likes: [],
                },
            }),
        });

        const onLikeAnimation = jest.fn();
        const vibrate = navigator.vibrate as jest.Mock;

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [fingerprint],
                onLikeAnimation,
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(vibrate).not.toHaveBeenCalled();
        expect(onLikeAnimation).not.toHaveBeenCalled();
    });

    it("does nothing when fingerprint is empty", async () => {
        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint: "",
                initialLikes: [],
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(fetch).not.toHaveBeenCalled();
        expect(result.current.likes).toEqual([]);
        expect(result.current.isLiking).toBe(false);
    });

    it("rolls back optimistic state when API returns an error", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error: {
                    code: "COMMENT_NOT_FOUND",
                    message: "Komentarz nie istnieje",
                },
            }),
        });

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        await act(async () => {
            await expect(result.current.handleLike()).resolves.toBeUndefined();
        });

        expect(result.current.likes).toEqual([]);
        expect(result.current.alreadyLiked).toBe(false);

        expect(mockHandleApiResponseError).toHaveBeenCalledWith(
            {
                code: "COMMENT_NOT_FOUND",
                message: "Komentarz nie istnieje",
            },
            {
                COMMENT_NOT_FOUND: {
                    type: "error",
                },
                INVALID_INPUT: {
                    type: "warning",
                },
                INTERNAL_ERROR: {
                    type: "error",
                },
            }
        );
    });

    it("handles INVALID_INPUT API error", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Nieprawidłowe dane",
                },
            }),
        });

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(result.current.likes).toEqual([]);

        expect(mockHandleApiResponseError).toHaveBeenCalledWith(
            {
                code: "INVALID_INPUT",
                message: "Nieprawidłowe dane",
            },
            expect.objectContaining({
                INVALID_INPUT: {
                    type: "warning",
                },
            })
        );
    });

    it("handles INTERNAL_ERROR API error", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Błąd serwera",
                },
            }),
        });

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        await act(async () => {
            await result.current.handleLike();
        });

        expect(result.current.likes).toEqual([]);

        expect(mockHandleApiResponseError).toHaveBeenCalledWith(
            {
                code: "INTERNAL_ERROR",
                message: "Błąd serwera",
            },
            expect.objectContaining({
                INTERNAL_ERROR: {
                    type: "error",
                },
            })
        );
    });

    it("sets isLiking while the mutation is pending", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        act(() => {
            void result.current.handleLike();
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(true);
            expect(result.current.likes).toEqual([fingerprint]);
        });

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        likes: [fingerprint],
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(false);
        });
    });

    it("does not start another mutation while a mutation is pending", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        act(() => {
            void result.current.handleLike();
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(true);
        });

        act(() => {
            void result.current.handleLike();
        });

        expect(fetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        likes: [fingerprint],
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(false);
        });
    });

    it("allows manually updating likes through setLikes", () => {
        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        act(() => {
            result.current.setLikes(["fingerprint-2"]);
        });

        expect(result.current.likes).toEqual(["fingerprint-2"]);
        expect(result.current.alreadyLiked).toBe(false);
    });
    it("optimistically adds fingerprint before API response", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [],
            })
        );

        act(() => {
            void result.current.handleLike();
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(true);
        });

        expect(result.current.likes).toEqual([fingerprint]);
        expect(fetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        likes: [fingerprint],
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(false);
        });
    });
    it("optimistically removes fingerprint before API response", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() =>
            useLikeComment({
                commentId,
                fingerprint,
                initialLikes: [fingerprint, "fingerprint-2"],
            })
        );

        expect(result.current.alreadyLiked).toBe(true);

        act(() => {
            void result.current.handleLike();
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(true);
        });

        expect(result.current.likes).toEqual(["fingerprint-2"]);
        expect(fetch).toHaveBeenCalledTimes(1);

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        likes: ["fingerprint-2"],
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isLiking).toBe(false);
        });
    });
});
