// hooks/useDebouncedCallback.ts
import { useMemo, useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import type { DebouncedFunc } from "lodash";

export const useDebouncedCallback = <T extends unknown[]>(fn: (...args: T) => void, delay: number): { debounced: DebouncedFunc<(...args: T) => void>; flush: () => void } => {
    const fnRef = useRef(fn);
    fnRef.current = fn; // Keep fn up-to-date for closures

    const debounced = useMemo(
        (): DebouncedFunc<(...args: T) => void> =>
            debounce((...args: T) => {
                fnRef.current(...args);
            }, delay),
        [delay]
    );

    useEffect(() => {
        return () => {
            debounced.cancel();
        };
    }, [debounced]);

    return { debounced, flush: debounced.flush };
};
