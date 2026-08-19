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
        if (loading) return;

        setIsOpen(false);
    }, [loading]);

    // Potwierdza dialog
    const confirm = useCallback(async () => {
        if (!payload || loading) return;

        const currentPayload = payload;

        setLoading(true);

        try {
            await onConfirm(currentPayload);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    }, [payload, onConfirm, loading]);

    // Czyści dane dopiero po zakończeniu animacji zamykania
    const afterClose = useCallback(() => {
        setPayload(null);
    }, []);

    return {
        isOpen,
        payload,
        loading,
        openDialog,
        cancel,
        confirm,
        afterClose,
    } as const;
}
