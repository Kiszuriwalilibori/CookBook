import { act, renderHook, waitFor } from "@testing-library/react";

import { useApiResponseErrorHandler, useMessage } from "@/hooks";

import { useShortComment } from "./useShortComment";

// Hook zwraca początkowy skrócony komentarz i pozostaje w stanie bezczynności.
// Hook używa pustego tekstu jako wartości początkowej, gdy initialShortComment nie zostanie podany.
// Hook nie wysyła żądania, gdy nie podano identyfikatora komentarza, i wyświetla ostrzeżenie.
// Hook nie wysyła żądania, gdy treść skróconego komentarza jest pusta, i wyświetla ostrzeżenie.
// Hook nie wysyła żądania, gdy treść skróconego komentarza zawiera wyłącznie białe znaki.
// Hook usuwa zbędne białe znaki z początku i końca treści przed wysłaniem jej do API.
// Skrócony komentarz zostaje optymistycznie zaktualizowany jeszcze przed otrzymaniem odpowiedzi API.
// Hook wysyła poprawny request PATCH z identyfikatorem komentarza, oczyszczoną treścią i opcją HANDLE_SHORT_COMMENT.
// Hook przyjmuje treść skróconego komentarza zwróconą przez API jako końcowy stan.
// Po pomyślnym dodaniu skróconego komentarza wyświetlany jest komunikat sukcesu.
// W przypadku błędu API hook wycofuje optymistyczną zmianę, kończy stan wysyłania i przekazuje błąd do handlera.
// Błąd FORBIDDEN jest przekazywany do handlera z komunikatem o braku uprawnień administratora.
// Podczas oczekiwania na odpowiedź API hook pozostaje w stanie wysyłania, a po jej otrzymaniu wraca do stanu bezczynności.
// Publiczna metoda setShortComment pozwala ręcznie zmienić treść skróconego komentarza.

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: jest.fn(),
    useMessage: jest.fn(),
}));

describe("useShortComment", () => {
    const commentId = "comment-1";

    const mockHandleApiResponseError = jest.fn();

    const mockShowMessage = {
        success: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useApiResponseErrorHandler as jest.Mock).mockReturnValue(mockHandleApiResponseError);
        (useMessage as jest.Mock).mockReturnValue(mockShowMessage);

        global.fetch = jest.fn();
    });

    it("returns the initial short comment and idle state", () => {
        const { result } = renderHook(() =>
            useShortComment({
                initialShortComment: "Początkowy komentarz",
            })
        );

        expect(result.current.shortComment).toBe("Początkowy komentarz");
        expect(result.current.isShortCommentSubmitting).toBe(false);
    });

    it("uses an empty string when initialShortComment is not provided", () => {
        const { result } = renderHook(() => useShortComment({}));

        expect(result.current.shortComment).toBe("");
        expect(result.current.isShortCommentSubmitting).toBe(false);
    });

    it("does not submit when commentId is empty", async () => {
        const { result } = renderHook(() => useShortComment({}));

        let response: boolean;

        await act(async () => {
            response = await result.current.handleAddShortComment({
                commentId: "",
                shortContent: "Treść komentarza",
            });
        });

        expect(response!).toBe(false);
        expect(fetch).not.toHaveBeenCalled();

        expect(mockShowMessage.warning).toHaveBeenCalledWith("Brak treści skróconego komentarza");
    });

    it("does not submit when shortContent is empty", async () => {
        const { result } = renderHook(() => useShortComment({}));

        let response: boolean;

        await act(async () => {
            response = await result.current.handleAddShortComment({
                commentId,
                shortContent: "",
            });
        });

        expect(response!).toBe(false);
        expect(fetch).not.toHaveBeenCalled();

        expect(mockShowMessage.warning).toHaveBeenCalledWith("Brak treści skróconego komentarza");
    });

    it("does not submit when shortContent contains only whitespace", async () => {
        const { result } = renderHook(() => useShortComment({}));

        let response: boolean;

        await act(async () => {
            response = await result.current.handleAddShortComment({
                commentId,
                shortContent: "   ",
            });
        });

        expect(response!).toBe(false);
        expect(fetch).not.toHaveBeenCalled();

        expect(mockShowMessage.warning).toHaveBeenCalledWith("Brak treści skróconego komentarza");
    });

    it("trims shortContent before submitting", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    shortComment: {
                        content: "Skrócony komentarz",
                    },
                },
            }),
        });

        const { result } = renderHook(() => useShortComment({}));

        await act(async () => {
            await result.current.handleAddShortComment({
                commentId,
                shortContent: "  Skrócony komentarz  ",
            });
        });

        expect(fetch).toHaveBeenCalledWith("/api/comments", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId,
                shortContent: "Skrócony komentarz",
                option: "HANDLE_SHORT_COMMENT",
            }),
        });
    });

    it("optimistically updates the short comment before API response", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() =>
            useShortComment({
                initialShortComment: "Stary komentarz",
            })
        );

        act(() => {
            void result.current.handleAddShortComment({
                commentId,
                shortContent: "Nowy komentarz",
            });
        });

        await waitFor(() => {
            expect(result.current.isShortCommentSubmitting).toBe(true);
        });

        expect(result.current.shortComment).toBe("Nowy komentarz");

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        shortComment: {
                            content: "Nowy komentarz",
                        },
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isShortCommentSubmitting).toBe(false);
        });
    });

    it("sends the correct PATCH request", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    shortComment: {
                        content: "Skrócony komentarz",
                    },
                },
            }),
        });

        const { result } = renderHook(() => useShortComment({}));

        await act(async () => {
            await result.current.handleAddShortComment({
                commentId,
                shortContent: "Skrócony komentarz",
            });
        });

        expect(fetch).toHaveBeenCalledWith("/api/comments", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId,
                shortContent: "Skrócony komentarz",
                option: "HANDLE_SHORT_COMMENT",
            }),
        });
    });

    it("uses the short comment returned by the API as the final state", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    shortComment: {
                        content: "Treść zwrócona przez API",
                    },
                },
            }),
        });

        const { result } = renderHook(() =>
            useShortComment({
                initialShortComment: "Stara treść",
            })
        );

        await act(async () => {
            await result.current.handleAddShortComment({
                commentId,
                shortContent: "Treść wysłana",
            });
        });

        expect(result.current.shortComment).toBe("Treść zwrócona przez API");
    });

    it("shows a success message after successfully adding the short comment", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: {
                    shortComment: {
                        content: "Skrócony komentarz",
                    },
                },
            }),
        });

        const { result } = renderHook(() => useShortComment({}));

        await act(async () => {
            await result.current.handleAddShortComment({
                commentId,
                shortContent: "Skrócony komentarz",
            });
        });

        expect(mockShowMessage.success).toHaveBeenCalledWith("Skrócony komentarz został dodany");
    });

    it("rolls back the optimistic update and handles API error", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error: {
                    code: "COMMENT_NOT_FOUND",
                    message: "Komentarz nie został znaleziony",
                },
            }),
        });

        const { result } = renderHook(() =>
            useShortComment({
                initialShortComment: "Stary komentarz",
            })
        );

        const response = await act(async () =>
            result.current.handleAddShortComment({
                commentId,
                shortContent: "Nowy komentarz",
            })
        );

        expect(response).toBe(false);
        expect(result.current.shortComment).toBe("Stary komentarz");
        expect(result.current.isShortCommentSubmitting).toBe(false);

        expect(mockHandleApiResponseError).toHaveBeenCalledWith(
            {
                code: "COMMENT_NOT_FOUND",
                message: "Komentarz nie został znaleziony",
            },
            {
                FORBIDDEN: {
                    type: "error",
                    message: "Brak uprawnień administratora",
                },
                INVALID_INPUT: {
                    type: "warning",
                    message: "Nieprawidłowe dane",
                },
                EMPTY_SHORT_COMMENT: {
                    type: "warning",
                    message: "Skrócony komentarz nie może być pusty",
                },
                SHORT_COMMENT_TOO_LONG: {
                    type: "warning",
                    message: "Skrócony komentarz jest za długi",
                },
                COMMENT_NOT_FOUND: {
                    type: "warning",
                    message: "Komentarz nie został znaleziony",
                },
            }
        );
    });

    it("handles FORBIDDEN API error", async () => {
        (fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error: {
                    code: "FORBIDDEN",
                    message: "Brak uprawnień",
                },
            }),
        });

        const { result } = renderHook(() => useShortComment({}));

        await act(async () => {
            await result.current.handleAddShortComment({
                commentId,
                shortContent: "Komentarz",
            });
        });

        expect(mockHandleApiResponseError).toHaveBeenCalledWith(
            {
                code: "FORBIDDEN",
                message: "Brak uprawnień",
            },
            expect.objectContaining({
                FORBIDDEN: {
                    type: "error",
                    message: "Brak uprawnień administratora",
                },
            })
        );
    });

    it("sets submitting state while the API request is pending", async () => {
        let resolveRequest!: (value: unknown) => void;

        (fetch as jest.Mock).mockReturnValue(
            new Promise(resolve => {
                resolveRequest = resolve;
            })
        );

        const { result } = renderHook(() => useShortComment({}));

        act(() => {
            void result.current.handleAddShortComment({
                commentId,
                shortContent: "Komentarz",
            });
        });

        await waitFor(() => {
            expect(result.current.isShortCommentSubmitting).toBe(true);
        });

        await act(async () => {
            resolveRequest({
                json: async () => ({
                    ok: true,
                    data: {
                        shortComment: {
                            content: "Komentarz",
                        },
                    },
                }),
            });
        });

        await waitFor(() => {
            expect(result.current.isShortCommentSubmitting).toBe(false);
        });
    });

    it("allows manually updating the short comment through setShortComment", () => {
        const { result } = renderHook(() =>
            useShortComment({
                initialShortComment: "Stara treść",
            })
        );

        act(() => {
            result.current.setShortComment("Nowa treść");
        });

        expect(result.current.shortComment).toBe("Nowa treść");
    });
});
