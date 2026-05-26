"use client";

import { RefObject, useEffect } from "react";

type UseScrollFocusOnOpenParams = {
    isOpen: boolean;
    ref: RefObject<HTMLElement | null>; // kontener
    inputRef?: RefObject<HTMLTextAreaElement | null>; // opcjonalnie bezpośredni ref
    scrollIntoViewOptions?: ScrollIntoViewOptions;
};

export function useScrollFocusOnOpen({ isOpen, ref, inputRef, scrollIntoViewOptions = { behavior: "smooth", block: "center" } }: UseScrollFocusOnOpenParams) {
    useEffect(() => {
        if (!isOpen) return;

        const scrollAndFocus = () => {
            // Scroll
            ref.current?.scrollIntoView(scrollIntoViewOptions);

            // Focus - priorytet na bezpośredni ref, potem data-autofocus
            let targetInput = inputRef?.current;

            if (!targetInput) {
                targetInput = ref.current?.querySelector<HTMLTextAreaElement>("[data-autofocus]");
            }

            if (targetInput) {
                // Małe opóźnienie + focus + scroll do caret
                setTimeout(() => {
                    targetInput!.focus({ preventScroll: true });
                    targetInput!.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 50);
            }
        };

        // Czekamy aż Collapse się otworzy
        const timeout = setTimeout(scrollAndFocus, 420); // trochę więcej niż 400

        return () => clearTimeout(timeout);
    }, [isOpen, ref, inputRef, scrollIntoViewOptions]);
}
