import { useCallback, useRef, useEffect, useState } from "react";

export function useLikeAnimation(duration: number = 300) {
    const [animateLike, setAnimateLike] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const triggerLikeAnimation = useCallback(() => {
        // Wyczyść poprzedni timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setAnimateLike(true);
        navigator.vibrate?.(10);

        timeoutRef.current = setTimeout(() => {
            setAnimateLike(false);
            timeoutRef.current = null;
        }, duration);
    }, [duration]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { animateLike, triggerLikeAnimation } as const;
}
