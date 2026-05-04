// CommentForm.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx } from "./commentStyles";
import { Honeypot } from "./Honeypot";
/* ------------------ COMPONENT ------------------ */

export default function CommentForm({ onSubmit, submitLabel = "Dodaj" }: { onSubmit: (data: { author: string; content: string }) => Promise<void>; submitLabel?: string }) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const isAdminLogged = useIsAdminLogged();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

            const result = validateComment({
                author: finalAuthor,
                content,
            });

            setErrors(result.errors);

            if (!result.valid) {
                console.log(
                    "[COMMENT][VALIDATION_FAILED]",
                    result.errors.map(e => errorMessages[e] ?? e)
                );
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [author, content, isAdminLogged]);

    /* -------- submit (edge-case safe) -------- */
    async function handleSubmit() {
        if (!content.trim()) return;

        const finalAuthor = isAdminLogged ? "Piotr" : author.trim();
        if (!finalAuthor) return;

        const result = validateComment({
            author: finalAuthor,
            content,
        });

        if (!result.valid) {
            console.log(
                "[COMMENT][SUBMIT_BLOCKED]",
                result.errors.map(e => errorMessages[e] ?? e)
            );
            return;
        }

        await onSubmit({
            author: finalAuthor,
            content,
        });

        setAuthor("");
        setContent("");
    }

    /* -------- button logic (nie psujemy starej) -------- */
    const baseDisabled = !content.trim() || (!isAdminLogged && !author.trim());
    const validationFailed = errors.length > 0;

    return (
        <Paper elevation={1} sx={paperSx}>
            <Box sx={{ position: "relative" }}>
                {/* 🟢 honeypot – NIE RUSZAMY */}
                <Honeypot />
                {!isAdminLogged && <TextField autoComplete="off" fullWidth size="small" label="Przedstaw się" value={author} onChange={e => setAuthor(e.target.value)} color="secondary" sx={textFieldSx} />}

                <TextField fullWidth multiline autoComplete="off" minRows={3} size="small" label="Komentarz" value={content} onChange={e => setContent(e.target.value)} color="secondary" sx={textFieldSx} />

                <Button variant="contained" onClick={handleSubmit} disabled={baseDisabled || validationFailed} sx={submitButtonSx}>
                    {submitLabel}
                </Button>
            </Box>
        </Paper>
    );
}
