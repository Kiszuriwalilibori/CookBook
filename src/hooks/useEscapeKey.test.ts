import { renderHook } from "@testing-library/react";
import useEscapeKey from "./useEscapeKey";

const addEventListenerSpy = jest.spyOn(document, "addEventListener");
const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

describe("useEscapeKey", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("powinien dodać listener gdy modal jest otwarty", () => {
        const onClose = jest.fn();

        renderHook(() => useEscapeKey(true, onClose));

        expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it("nie powinien dodać listenera gdy modal jest zamknięty", () => {
        const onClose = jest.fn();

        renderHook(() => useEscapeKey(false, onClose));

        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it("powinien wywołać onClose po naciśnięciu Escape", () => {
        const onClose = jest.fn();
        let handler: ((e: KeyboardEvent) => void) | null = null;

        addEventListenerSpy.mockImplementation((_, cb) => {
            handler = cb as (e: KeyboardEvent) => void;
        });

        renderHook(() => useEscapeKey(true, onClose));

        // Symulujemy naciśnięcie klawisza Escape
        const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
        handler!(escapeEvent);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("nie powinien wywołać onClose po naciśnięciu innego klawisza", () => {
        const onClose = jest.fn();
        let handler: ((e: KeyboardEvent) => void) | null = null;

        addEventListenerSpy.mockImplementation((_, cb) => {
            handler = cb as (e: KeyboardEvent) => void;
        });

        renderHook(() => useEscapeKey(true, onClose));

        const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
        handler!(enterEvent);

        expect(onClose).not.toHaveBeenCalled();
    });

    it("powinien usunąć listener przy unmount", () => {
        const onClose = jest.fn();

        const { unmount } = renderHook(() => useEscapeKey(true, onClose));

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("powinien ponownie dodać listener po zmianie isOpen z false → true", () => {
        const onClose = jest.fn();

        const { rerender } = renderHook(({ isOpen }) => useEscapeKey(isOpen, onClose), { initialProps: { isOpen: false } });

        expect(addEventListenerSpy).not.toHaveBeenCalled();

        rerender({ isOpen: true });

        expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });
});
