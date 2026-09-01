import { useEffect, useRef } from "react";

export const useRecipeNotesModalFocus = (open: boolean, delay = 100) => {
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

    const hasOpenedOnce = useRef(false);

    useEffect(() => {
        if (!open || hasOpenedOnce.current) {
            return;
        }

        hasOpenedOnce.current = true;

        const timeoutId = setTimeout(() => {
            const input = inputRef.current;

            if (!input) {
                return;
            }

            input.focus();

            const length = input.value.length;
            input.setSelectionRange(length, length);
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [open, delay]);

    return inputRef;
};
