"use client";
import { useRef, useEffect, useState } from "react";
import { useLoginStatus } from "@/stores/useAdminStore";

/**
 * Returns true **if loginStatus changed** since last render, false otherwise.
 */
export function useLoginStatusChange(): boolean {
    const currentStatus = useLoginStatus();
    const prevRef = useRef<string | null>(null);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        if (prevRef.current !== null && prevRef.current !== currentStatus) {
            setChanged(true);
        } else {
            setChanged(false);
        }

        prevRef.current = currentStatus;
    }, [currentStatus]);

    return changed;
}
