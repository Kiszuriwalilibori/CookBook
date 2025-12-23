// app/recipes/[slug]/parts/RecipeKeepAwakeButton.tsx (fixed: local typing with type guards, no global extension)
"use client";

import { IconButton, Tooltip } from "@mui/material";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import { useState, useEffect, useCallback } from "react";
import { styles } from "../styles";

// Minimal local type for Wake Lock API (avoids conflicts)
type WakeLockSentinel = {
    released: Promise<void>;
    release(): Promise<void>;
};

type WakeLock = {
    request(mode: "screen"): Promise<WakeLockSentinel>;
};

export function RecipeKeepAwakeButton() {
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
    const [isActive, setIsActive] = useState(false);

    const requestWakeLock = useCallback(async () => {
        try {
            const nav = navigator as unknown as { wakeLock?: WakeLock };
            if (nav.wakeLock) {
                const lock = await nav.wakeLock.request("screen");
                setWakeLock(lock);
                setIsActive(true);
            } else {
                console.warn("Wake Lock API not supported; consider adding silent audio fallback.");
            }
        } catch (err) {
            console.error("Wake Lock request failed:", err);
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLock !== null) {
            await wakeLock.release();
            setWakeLock(null);
            setIsActive(false);
        }
    }, [wakeLock]);

    useEffect(() => {
        return () => {
            releaseWakeLock();
        };
    }, [releaseWakeLock]);

    const handleToggle = () => {
        if (isActive) {
            releaseWakeLock();
        } else {
            requestWakeLock();
        }
    };

    return (
        <Tooltip title={isActive ? "Wyłącz zapobieganie ciemieniu ekranu" : "Zapobiegaj ciemieniu ekranu (aktywuj jasność)"} placement="top">
            <IconButton id="RecipeKeepAwakeButton" onClick={handleToggle} sx={styles.recipeButton}>
                <BrightnessHighIcon sx={{ fontSize: "48px" }} /> {/* Twice bigger icon (default 24px → 48px) */}
            </IconButton>
        </Tooltip>
    );
}

export default RecipeKeepAwakeButton;
