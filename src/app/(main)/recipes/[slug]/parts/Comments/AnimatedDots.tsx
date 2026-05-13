import React from "react";
import { useState, useEffect } from "react";

export const AnimatedDots = React.memo(function AnimatedDots() {
    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return ".";
                return prev + ".";
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return <>{dots}</>;
});
