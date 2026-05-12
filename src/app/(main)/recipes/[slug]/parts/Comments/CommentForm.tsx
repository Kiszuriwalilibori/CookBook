// CommentForm.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, FormLabel, Typography } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx, formLabelSx } from "./commentStyles";
import { Honeypot } from "./Honeypot";
// import { useMessage } from "@/hooks";

/* ------------------ COMPONENT ------------------ */

export default function CommentForm({
    textAreaRef,
    onSubmit,
    submitLabel = "Dodaj",
    onCancel,
}: {
    textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null;
    onSubmit: (data: { author: string; content: string /*isAuthor: boolean*/ }) => Promise<void>;
    submitLabel?: string;
    onCancel?: () => void;
}) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const isAdminLogged = useIsAdminLogged();
    // const showMessage = useMessage();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

            const result = validateComment({
                author: finalAuthor,
                content,
            });

            setErrors(result.errors);
            // if (!result.valid) {
            //     result.errors.forEach(error => {
            //         showMessage.warning(errorMessages[error] ?? error);
            //     });
            // }

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
        const isAuthor = isAdminLogged;
        console.log("isAuthor from form", isAuthor);
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
                {!isAdminLogged && (
                    <>
                        <FormLabel required sx={formLabelSx}>
                            Przedstaw się
                        </FormLabel>
                        <TextField
                            inputRef={textAreaRef}
                            slotProps={{
                                htmlInput: {
                                    "aria-label": "Imię autora komentarza",
                                },
                            }}
                            autoComplete="off"
                            fullWidth
                            size="small"
                            label="Przedstaw się"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            color="secondary"
                            sx={textFieldSx}
                        />
                    </>
                )}
                <>
                    <FormLabel required sx={formLabelSx}>
                        Skomentuj
                    </FormLabel>

                    <TextField
                        slotProps={{
                            htmlInput: {
                                "aria-label": "Treść komentarza",
                            },
                        }}
                        fullWidth
                        multiline
                        autoComplete="off"
                        minRows={3}
                        size="small"
                        label="Komentarz"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        color="secondary"
                        sx={textFieldSx}
                    />
                </>
                <Box display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} justifyContent={{ xs: "stretch", sm: "space-evenly" }} alignItems="center" gap={1} mt={1}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} disabled={baseDisabled || validationFailed} sx={submitButtonSx}>
                        {submitLabel}
                    </Button>
                    {onCancel && (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={onCancel}
                            fullWidth
                            sx={{
                                flex: { sm: 1 },
                                minWidth: { sm: 140 },
                            }}
                        >
                            Anuluj
                        </Button>
                    )}
                </Box>
                {errors.length > 0 && (
                    <Box mt={1}>
                        {errors.map(error => (
                            <Typography key={error} variant="caption" color="error" display="block">
                                {errorMessages[error] ?? error}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
