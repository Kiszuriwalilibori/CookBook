"use client";

import { useEffect, useRef, useState } from "react";

const DELAY = 500;
const DURATION = 1000;

export const useDelayedCondition = (condition: boolean, delay = DELAY, duration = DURATION) => {
    const [delayedCondition, setDelayedCondition] = useState(false);
    const delayTimeout = useRef(undefined as undefined | NodeJS.Timeout);
    const startTime = useRef(undefined as undefined | number);
    const durationTimeout = useRef(undefined as undefined | NodeJS.Timeout);

    useEffect(() => {
        const now = Date.now();
        if (condition) {
            startTime.current = now;
            delayTimeout.current = setTimeout(() => {
                setDelayedCondition(true);
            }, delay);
        }
        if (!condition) {
            if (startTime.current) {
                if (now >= startTime.current + delay) {
                    durationTimeout.current = setTimeout(
                        () => {
                            if (delayTimeout.current) {
                                clearTimeout(delayTimeout.current);
                            }
                            setDelayedCondition(false);
                        },
                        duration - (now - (startTime.current + delay)) //
                    );
                }
                if (now < startTime.current + delay) {
                    if (delayTimeout.current) {
                        clearTimeout(delayTimeout.current);
                    }
                    setDelayedCondition(false);
                }
            }
        }
        return () => {
            if (delayTimeout.current) {
                clearTimeout(delayTimeout.current);
            }
            if (durationTimeout.current) {
                clearTimeout(durationTimeout.current);
            }
        };
    }, [condition]);

    return delayedCondition;
};

export default useDelayedCondition;
