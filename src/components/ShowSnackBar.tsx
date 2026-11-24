"use client";

import { useEffect, useRef } from "react";
import { useApiResponseErrorHandler } from "@/hooks";
import type { ApiErrorPayload } from "@/models/apiResponse";

interface ShowSnackbarProps {
    error: ApiErrorPayload | null;
}

export default function ShowSnackbar({ error }: ShowSnackbarProps) {
    const handleApiResponseError = useApiResponseErrorHandler();
    const lastErrorRef = useRef<ApiErrorPayload | null>(null);

    useEffect(() => {
        if (!error) {
            lastErrorRef.current = null;
            return;
        }

        if (lastErrorRef.current === error) return;

        lastErrorRef.current = error;
        handleApiResponseError(error);
    }, [error, handleApiResponseError]);

    return null;
}
