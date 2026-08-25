import { act, renderHook, waitFor } from "@testing-library/react";

import { useReplyComment } from "./useReplyComment";
// Hook rozpoczyna działanie z zamkniętym formularzem odpowiedzi i bez trwającego wysyłania.
// Wywołanie toggleReplyForm otwiera formularz odpowiedzi.
// Ponowne wywołanie toggleReplyForm zamyka wcześniej otwarty formularz.
// Anulowanie odpowiedzi zamyka formularz.
// Rozpoczęcie wysyłania odpowiedzi zamyka formularz i ustawia stan wysyłania do czasu zakończenia operacji.
// Dane odpowiedzi oraz identyfikator komentowanego komentarza są przekazywane do handleAddComment z właściwym parentId.
// Po pomyślnym dodaniu odpowiedzi stan wysyłania zostaje wyłączony.
// W przypadku błędu podczas dodawania odpowiedzi stan wysyłania zostaje wyłączony, a błąd jest przekazywany dalej.
// Samo otwieranie, zamykanie i anulowanie formularza nie wywołuje handleAddComment.
describe("useReplyComment", () => {
    const commentId = "comment-1";

    it("returns initial form state", () => {
        const handleAddComment = jest.fn();

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        expect(result.current.formOpen).toBe(false);
        expect(result.current.isReplySubmitting).toBe(false);
    });

    it("opens the reply form", () => {
        const handleAddComment = jest.fn();

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        act(() => {
            result.current.toggleReplyForm();
        });

        expect(result.current.formOpen).toBe(true);
    });

    it("closes the reply form when toggled", () => {
        const handleAddComment = jest.fn();

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        act(() => {
            result.current.toggleReplyForm();
        });

        expect(result.current.formOpen).toBe(true);

        act(() => {
            result.current.toggleReplyForm();
        });

        expect(result.current.formOpen).toBe(false);
    });

    it("closes the reply form when cancelled", () => {
        const handleAddComment = jest.fn();

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        act(() => {
            result.current.toggleReplyForm();
        });

        expect(result.current.formOpen).toBe(true);

        act(() => {
            result.current.handleReplyCancel();
        });

        expect(result.current.formOpen).toBe(false);
    });

    it("closes the form and starts submitting when a reply is submitted", async () => {
        let resolveAddComment!: () => void;

        const handleAddComment = jest.fn(
            () =>
                new Promise<void>(resolve => {
                    resolveAddComment = resolve;
                })
        );

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        act(() => {
            result.current.toggleReplyForm();
        });

        expect(result.current.formOpen).toBe(true);

        act(() => {
            void result.current.handleReplySubmit({
                author: "Jan",
                content: "Świetny przepis!",
            });
        });

        await waitFor(() => {
            expect(result.current.formOpen).toBe(false);
            expect(result.current.isReplySubmitting).toBe(true);
        });

        await act(async () => {
            resolveAddComment();
        });

        await waitFor(() => {
            expect(result.current.isReplySubmitting).toBe(false);
        });
    });

    it("passes the reply data and commentId as parentId to handleAddComment", async () => {
        const handleAddComment = jest.fn().mockResolvedValue(undefined);

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        await act(async () => {
            await result.current.handleReplySubmit({
                author: "Jan",
                content: "Świetny przepis!",
            });
        });

        expect(handleAddComment).toHaveBeenCalledWith({
            author: "Jan",
            content: "Świetny przepis!",
            parentId: commentId,
        });
    });

    it("does not keep the submitting state after a successful reply", async () => {
        const handleAddComment = jest.fn().mockResolvedValue(undefined);

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        await act(async () => {
            await result.current.handleReplySubmit({
                author: "Jan",
                content: "Dziękuję!",
            });
        });

        expect(result.current.isReplySubmitting).toBe(false);
    });

    it("resets the submitting state when handleAddComment fails", async () => {
        const error = new Error("Failed to add comment");

        const handleAddComment = jest.fn().mockRejectedValue(error);

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        await act(async () => {
            await expect(
                result.current.handleReplySubmit({
                    author: "Jan",
                    content: "Świetny przepis!",
                })
            ).rejects.toThrow("Failed to add comment");
        });

        expect(result.current.formOpen).toBe(false);
        expect(result.current.isReplySubmitting).toBe(false);
    });

    it("does not call handleAddComment when only the form is toggled or cancelled", () => {
        const handleAddComment = jest.fn();

        const { result } = renderHook(() =>
            useReplyComment({
                commentId,
                handleAddComment,
            })
        );

        act(() => {
            result.current.toggleReplyForm();
            result.current.handleReplyCancel();
        });

        expect(handleAddComment).not.toHaveBeenCalled();
    });
});
