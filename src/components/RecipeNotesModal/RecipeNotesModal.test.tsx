/**

* Modal wyświetla pole tekstowe z początkową wartością notatki.
*
* Modal ustawia fokus na polu tekstowym przy pierwszym otwarciu
* i umieszcza kursor na końcu istniejącej treści.
*
* Timer odpowiedzialny za ustawienie fokusu jest czyszczony
* podczas cleanupu efektu.
*
* Modal ogranicza długość wpisywanej notatki do MAX_PRIVATE_NOTE_LENGTH.
*
* Nie pozwala zapisać pustej notatki.
*
* Po pomyślnym zapisaniu notatki wykonuje router.refresh()
* i zamyka modal.
*
* Przy błędzie API wywołuje useApiResponseErrorHandler
* i nie zamyka modala.
*
* Przycisk „Usuń” otwiera dialog potwierdzenia.
*
* Anulowanie dialogu usuwania zamyka dialog, ale pozostawia modal otwarty.
*
* Po pomyślnym usunięciu notatki wykonuje router.refresh()
* i zamyka modal oraz dialog usuwania.
*
* Po ponownym otwarciu modala dialog usuwania pozostaje zamknięty.
  */

import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";

import RecipeNotesModal from "./RecipeNotesModal";

import { MAX_PRIVATE_NOTE_LENGTH } from "@/setup";

import { useApiResponseErrorHandler } from "@/hooks";

const mockRouterRefresh = jest.fn();
const mockHandleApiResponseError = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: mockRouterRefresh,
    }),
}));

jest.mock("@/hooks", () => ({
    useApiResponseErrorHandler: jest.fn(),
}));

jest.mock("@/hooks/useEscapeKey", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@/hooks/useReducedMotion", () => ({
    useReducedMotion: jest.fn(() => true),
}));

describe("RecipeNotesModal", () => {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
        initialValue: "Moja notatka",
        recipeId: "recipe-1",
    };

    const renderModal = (props: Partial<React.ComponentProps<typeof RecipeNotesModal>> = {}) => {
        return render(<RecipeNotesModal {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();

        (useApiResponseErrorHandler as jest.Mock).mockReturnValue(mockHandleApiResponseError);

        global.fetch = jest.fn();

        window.alert = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders the modal with the initial note value", () => {
        renderModal();

        expect(
            screen.getByRole("textbox", {
                name: "Twoje notatki",
            })
        ).toHaveValue("Moja notatka");
    });

    it("focuses the textarea and places the cursor at the end on first open", () => {
        jest.useFakeTimers();

        renderModal();

        const textarea = screen.getByRole("textbox", {
            name: "Twoje notatki",
        }) as HTMLTextAreaElement;

        const focusSpy = jest.spyOn(textarea, "focus");
        const setSelectionRangeSpy = jest.spyOn(textarea, "setSelectionRange");

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(setSelectionRangeSpy).toHaveBeenCalledWith("Moja notatka".length, "Moja notatka".length);

        focusSpy.mockRestore();
        setSelectionRangeSpy.mockRestore();
    });

    it("clears the focus timeout during effect cleanup", () => {
        jest.useFakeTimers();

        const { unmount } = renderModal();

        const textarea = screen.getByRole("textbox", {
            name: "Twoje notatki",
        });

        const focusSpy = jest.spyOn(textarea, "focus");

        unmount();

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(focusSpy).not.toHaveBeenCalled();

        focusSpy.mockRestore();
    });

    it("limits the note length to MAX_PRIVATE_NOTE_LENGTH", () => {
        renderModal();

        const textarea = screen.getByRole("textbox", {
            name: "Twoje notatki",
        });

        const longValue = "a".repeat(MAX_PRIVATE_NOTE_LENGTH + 50);

        fireEvent.change(textarea, {
            target: {
                value: longValue,
            },
        });

        expect(textarea).toHaveValue(longValue.slice(0, MAX_PRIVATE_NOTE_LENGTH));
    });

    it("does not save an empty note", () => {
        renderModal();

        const textarea = screen.getByRole("textbox", {
            name: "Twoje notatki",
        });

        fireEvent.change(textarea, {
            target: {
                value: "   ",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Zapisz",
            })
        );

        expect(window.alert).toHaveBeenCalledWith("Notatka nie może być pusta!");

        expect(global.fetch).not.toHaveBeenCalled();
        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("saves the note, refreshes the router and closes the modal", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: null,
            }),
        });

        renderModal();

        const textarea = screen.getByRole("textbox", {
            name: "Twoje notatki",
        });

        fireEvent.change(textarea, {
            target: {
                value: "  Nowa notatka  ",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Zapisz",
            })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/recipe-notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: "recipe-1",
                    notes: "Nowa notatka",
                }),
            });
        });

        expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("handles API error without closing the modal", async () => {
        const error = {
            code: "RECIPE_NOT_FOUND",
            message: "Nie znaleziono przepisu",
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: false,
                error,
            }),
        });

        renderModal();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Zapisz",
            })
        );

        await waitFor(() => {
            expect(mockHandleApiResponseError).toHaveBeenCalledWith(
                error,
                expect.objectContaining({
                    RECIPE_NOT_FOUND: {
                        type: "warning",
                    },
                })
            );
        });

        expect(defaultProps.onClose).not.toHaveBeenCalled();
        expect(mockRouterRefresh).not.toHaveBeenCalled();
    });

    it("opens the delete confirmation dialog", async () => {
        renderModal();

        expect(
            screen.queryByRole("dialog", {
                name: "Usuń notatkę",
            })
        ).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń",
            })
        );

        const dialog = await screen.findByRole("dialog", {
            name: "Usuń notatkę",
        });

        expect(dialog).toBeVisible();

        expect(within(dialog).getByText("Czy na pewno chcesz usunąć tę notatkę?")).toBeVisible();
    });

    it("closes the delete dialog when cancelled and keeps the modal open", async () => {
        renderModal();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń",
            })
        );

        const deleteDialog = await screen.findByRole("dialog", {
            name: "Usuń notatkę",
        });

        fireEvent.click(
            within(deleteDialog).getByRole("button", {
                name: "Anuluj",
            })
        );

        await waitForElementToBeRemoved(deleteDialog);

        const notesDialog = screen.getByRole("dialog", {
            name: "Notatki do przepisu",
        });

        expect(notesDialog).toBeVisible();

        expect(
            within(notesDialog).getByRole("textbox", {
                name: "Twoje notatki",
            })
        ).toBeVisible();

        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it("deletes the note, refreshes the router and closes the modal and delete dialog", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: null,
            }),
        });

        renderModal();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń",
            })
        );

        const deleteDialog = await screen.findByRole("dialog", {
            name: "Usuń notatkę",
        });

        fireEvent.click(
            within(deleteDialog).getByRole("button", {
                name: "Usuń",
            })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/recipe-notes?recipeId=recipe-1", {
                method: "DELETE",
            });
        });

        expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);

        await waitForElementToBeRemoved(deleteDialog);
    });

    it("keeps the delete dialog closed after reopening the modal", async () => {
        const onClose = jest.fn();

        (global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                ok: true,
                data: null,
            }),
        });

        const { rerender } = render(<RecipeNotesModal {...defaultProps} open={true} onClose={onClose} />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Usuń",
            })
        );

        const deleteDialog = await screen.findByRole("dialog", {
            name: "Usuń notatkę",
        });

        fireEvent.click(
            within(deleteDialog).getByRole("button", {
                name: "Usuń",
            })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/recipe-notes?recipeId=recipe-1", {
                method: "DELETE",
            });
        });

        expect(onClose).toHaveBeenCalledTimes(1);

        await waitForElementToBeRemoved(deleteDialog);

        rerender(<RecipeNotesModal {...defaultProps} open={false} onClose={onClose} />);

        rerender(<RecipeNotesModal {...defaultProps} open={true} onClose={onClose} />);

        expect(
            screen.queryByRole("dialog", {
                name: "Usuń notatkę",
            })
        ).not.toBeInTheDocument();
    });
});
