"use client";

import { useState, useCallback } from "react";

interface UseConfirmDialogOptions<T> {
    onConfirm: (payload: T) => Promise<void> | void;
}

export function useConfirmDialog<T>({ onConfirm }: UseConfirmDialogOptions<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [payload, setPayload] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);

    // Otwiera dialog z danym obiektem
    const openDialog = useCallback((value: T) => {
        setPayload(value);
        setIsOpen(true);
    }, []);

    // Anuluje dialog
    const cancel = useCallback(() => {
        if (loading) return; // blokada anulowania w trakcie akcji
        setIsOpen(false);
        setPayload(null);
    }, [loading]);

    // Potwierdza dialog
    const confirm = useCallback(async () => {
        if (!payload || loading) return; // blokada podwójnego kliknięcia

        setLoading(true);
        try {
            await onConfirm(payload);
        } finally {
            setLoading(false);
            setIsOpen(false);
            setPayload(null);
        }
    }, [payload, onConfirm, loading]);

    return {
        isOpen,
        payload,
        loading,
        openDialog,
        cancel,
        confirm,
    } as const;
}
