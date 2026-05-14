// utils/setInitialFocusInCommentItem.ts

"use client";

import { useEffect, useRef } from "react";

export function useSetInitialFocusInCommentItem(formOpen: boolean) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (formOpen) {
            textAreaRef.current?.focus();
        }
    }, [formOpen]);

    return textAreaRef;
}
