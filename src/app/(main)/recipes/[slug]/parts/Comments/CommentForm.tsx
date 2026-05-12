// CommentForm.tsx

"use client";

import { useState, useRef } from "react";
import { Box, TextField, Button, Paper, FormLabel, Typography } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx, formLabelSx, fieldRowSx } from "./commentStyles";
import { Honeypot } from "./Honeypot";

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
    const [isValid, setIsValid] = useState<boolean>(true);

    const [authorErrors, setAuthorErrors] = useState<string[]>([]);
    const [contentErrors, setContentErrors] = useState<string[]>([]);

    const [authorShowErrors, setAuthorShowErrors] = useState(false);
    const [contentShowErrors, setContentShowErrors] = useState(false);
    const [authorActivated, setAuthorActivated] = useState(false);
    const [contentActivated, setContentActivated] = useState(false);
    const authorRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const isAdminLogged = useIsAdminLogged();
    // const showMessage = useMessage();
    function resetForm() {
        setAuthor("");
        setContent("");

        setAuthorErrors([]);
        setContentErrors([]);
        setAuthorShowErrors(false);
        setContentShowErrors(false);
        setAuthorActivated(false);
        setContentActivated(false);

        setIsValid(true);
    }

    function runValidation(nextAuthor: string, nextContent: string) {
        const finalAuthor = isAdminLogged ? "Piotr" : nextAuthor.trim();

        const result = validateComment({
            author: finalAuthor,
            content: nextContent,
        });

        setAuthorErrors(result.authorErrors);
        setContentErrors(result.contentErrors);
        setIsValid(result.isValid);
    }
    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

    //         const result = validateComment({
    //             author: finalAuthor,
    //             content,
    //         });

    //         setAuthorErrors(result.authorErrors);
    //         setContentErrors(result.contentErrors);
    //         setIsValid(result.isValid);
    //         // if (!result.valid) {
    //         //     result.errors.forEach(error => {
    //         //         showMessage.warning(errorMessages[error] ?? error);
    //         //     });
    //         // }

    //         if (!result.isValid) {
    //             console.log("[COMMENT][VALIDATION_FAILED]", { authorErrors: result.authorErrors, contentErrors: result.contentErrors });
    //         }
    //     }, 500);

    //     return () => clearTimeout(timeout);
    // }, [author, content, isAdminLogged]);

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

        if (!result.isValid) {
            console.log("[COMMENT][SUBMIT_BLOCKED]", {
                authorErrors: result.authorErrors,
                contentErrors: result.contentErrors,
            });
            return;
        }

        await onSubmit({
            author: finalAuthor,
            content,
        });

        setAuthor("");
        setContent("");
        setAuthorErrors([]); // nowe
        setContentErrors([]);
        setIsValid(true);
    }

    /* -------- button logic (nie psujemy starej) -------- */
    const baseDisabled = !content.trim() || (!isAdminLogged && !author.trim());

    return (
        <Paper elevation={1} sx={paperSx}>
            <Box sx={{ position: "relative" }}>
                {/* 🟢 honeypot – NIE RUSZAMY */}
                <Honeypot />
                {!isAdminLogged && (
                    <Box
                        sx={fieldRowSx}
                        ref={authorRef}
                        onMouseLeave={() => {
                            if (authorActivated) {
                                setAuthorShowErrors(true);
                            }
                        }}
                    >
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
                            onChange={e => {
                                const value = e.target.value;
                                setAuthor(value);
                                runValidation(value, content);
                            }}
                            onFocus={() => setAuthorActivated(true)}
                            color="secondary"
                            sx={textFieldSx}
                        />
                        {authorShowErrors && authorErrors.length > 0 && (
                            <Box mt={0.5}>
                                {authorErrors.map(err => (
                                    <Typography key={err} variant="caption" color="error" display="block">
                                        {errorMessages[err] ?? err}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
                <Box
                    sx={fieldRowSx}
                    ref={contentRef}
                    onMouseLeave={() => {
                        if (contentActivated) {
                            setContentShowErrors(true);
                        }
                    }}
                >
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
                        onChange={e => {
                            const value = e.target.value;
                            setContent(value);
                            runValidation(value, content);
                        }}
                        onFocus={() => setContentActivated(true)}
                        color="secondary"
                        sx={textFieldSx}
                    />
                </Box>
                {contentShowErrors && contentErrors.length > 0 && (
                    <Box mt={0.5}>
                        {contentErrors.map(err => (
                            <Typography key={err} variant="caption" color="error" display="block">
                                {errorMessages[err] ?? err}
                            </Typography>
                        ))}
                    </Box>
                )}
                <Box display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} justifyContent={{ xs: "stretch", sm: "space-evenly" }} alignItems="center" gap={1} mt={1}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} disabled={baseDisabled || !isValid} sx={submitButtonSx}>
                        {submitLabel}
                    </Button>
                    {onCancel && (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                resetForm();
                                onCancel?.();
                            }}
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
            </Box>
        </Paper>
    );
}
