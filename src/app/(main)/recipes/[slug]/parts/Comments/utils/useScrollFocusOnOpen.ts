// // hooks/useScrollFocusOnOpen.ts
// "use client";

// import { RefObject, useEffect } from "react";

// type UseScrollFocusOnOpenParams = {
//     isOpen: boolean;

//     ref: RefObject<HTMLElement | null>;

//     delay?: number;

//     scrollIntoViewOptions?: ScrollIntoViewOptions;
// };

// export function useScrollFocusOnOpen({
//     isOpen,
//     ref,
//     delay = 300,
//     scrollIntoViewOptions = {
//         behavior: "smooth",
//         block: "center",
//     },
// }: UseScrollFocusOnOpenParams) {
//     useEffect(() => {
//         if (!isOpen || !ref.current) {
//             return;
//         }

//         ref.current.scrollIntoView(scrollIntoViewOptions);

//         const timeoutId = window.setTimeout(() => {
//             const input = ref.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");

//             input?.focus();
//         }, delay);

//         return () => {
//             window.clearTimeout(timeoutId);
//         };
//     }, [delay, isOpen, ref, scrollIntoViewOptions]);
// }
// "use client";

// import { RefObject, useEffect } from "react";

// type UseScrollFocusOnOpenParams = {
//     isOpen: boolean;

//     ref: RefObject<HTMLElement | null>;

//     scrollIntoViewOptions?: ScrollIntoViewOptions;
// };

// export function useScrollFocusOnOpen({
//     isOpen,
//     ref,
//     scrollIntoViewOptions = {
//         behavior: "smooth",
//         block: "center",
//     },
// }: UseScrollFocusOnOpenParams) {
//     useEffect(() => {
//         if (!isOpen || !ref.current) {
//             return;
//         }

//         ref.current.scrollIntoView(scrollIntoViewOptions);

//         const raf1 = requestAnimationFrame(() => {
//             const raf2 = requestAnimationFrame(() => {
//                 // const input = ref.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
//                 const input = ref.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("[data-autofocus]");
//                 input?.focus();
//                 console.log(document.activeElement);
//             });

//             return () => cancelAnimationFrame(raf2);
//         });

//         return () => {
//             cancelAnimationFrame(raf1);
//         };
//     }, [isOpen, ref, scrollIntoViewOptions]);
// }
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
