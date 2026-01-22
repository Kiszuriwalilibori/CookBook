"use client";

import { useState, useCallback } from "react";

interface UseConfirmDialogOptions<T> {
    onConfirm: (payload: T) => Promise<void> | void;
}

export function useConfirmDialog<T>({ onConfirm }: UseConfirmDialogOptions<T>) {
    const [open, setOpen] = useState(false);
    const [payload, setPayload] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);

    const requestConfirm = useCallback((value: T) => {
        setPayload(value);
        setOpen(true);
    }, []);

    const cancel = useCallback(() => {
        setOpen(false);
        setPayload(null);
    }, []);

    const confirm = useCallback(async () => {
        if (!payload) return;

        setLoading(true);
        try {
            await onConfirm(payload);
        } finally {
            setLoading(false);
            setOpen(false);
            setPayload(null);
        }
    }, [payload, onConfirm]);

    return {
        open,
        payload,
        loading,
        requestConfirm,
        cancel,
        confirm,
    };
}
