"use client";
import { useEffect } from "react";

export function useClearQueryParams() {
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.search) {
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState({}, document.title, url.toString());
        }
    }, []);
}
