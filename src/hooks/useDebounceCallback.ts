//TODO uwaga, hook otej nazwie już jest ale w innej lokalizacji tutaj!



import { useRef, useCallback, useEffect } from "react";

type DebounceOptions = {
    delay?: number;
    leading?: boolean;
    trailing?: boolean;
};

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(fn: T, { delay = 400, leading = false, trailing = true }: DebounceOptions = {}) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastArgs = useRef<Parameters<T> | null>(null);
    const hasCalledLeading = useRef(false);

    const cancel = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        hasCalledLeading.current = false;
    }, []);

    const callback = useCallback(
        (...args: Parameters<T>) => {
            lastArgs.current = args;

            if (leading && !timer.current && !hasCalledLeading.current) {
                fn(...args);
                hasCalledLeading.current = true;
            }

            if (timer.current) {
                clearTimeout(timer.current);
            }

            timer.current = setTimeout(() => {
                if (trailing && lastArgs.current) {
                    fn(...lastArgs.current);
                }

                timer.current = null;
                hasCalledLeading.current = false;
            }, delay);
        },
        [fn, delay, leading, trailing]
    );

    useEffect(() => cancel, [cancel]);

    return { callback, cancel };
}
