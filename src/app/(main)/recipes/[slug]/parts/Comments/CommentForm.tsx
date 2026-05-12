"use client";

import { useState } from "react";
import { Box, TextField, Button, Paper, FormLabel, Typography } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx, formLabelSx, fieldRowSx } from "./commentStyles";
import { Honeypot } from "./Honeypot";

export default function CommentForm({ textAreaRef, onSubmit, submitLabel = "Dodaj", onCancel }: { textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null; onSubmit: (data: { author: string; content: string }) => Promise<void>; submitLabel?: string; onCancel?: () => void }) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const [authorShowErrors, setAuthorShowErrors] = useState(false);
    const [contentShowErrors, setContentShowErrors] = useState(false);

    const [authorActivated, setAuthorActivated] = useState(false);
    const [contentActivated, setContentActivated] = useState(false);

    const isAdminLogged = useIsAdminLogged();

    // 🔥 single source of truth for validation
    const validation = validateComment({
        author: isAdminLogged ? "Piotr" : author.trim(),
        content,
    });

    function resetForm() {
        setAuthor("");
        setContent("");

        setAuthorShowErrors(false);
        setContentShowErrors(false);
        setAuthorActivated(false);
        setContentActivated(false);
    }

    async function handleSubmit() {
        const finalAuthor = isAdminLogged ? "Piotr" : author.trim();

        const result = validateComment({
            author: finalAuthor,
            content,
        });

        if (!result.isValid) {
            setAuthorShowErrors(true);
            setContentShowErrors(true);
            return;
        }

        await onSubmit({
            author: finalAuthor,
            content,
        });

        resetForm();
    }

    const baseDisabled = !content.trim() || (!isAdminLogged && !author.trim());

    return (
        <Paper elevation={1} sx={paperSx}>
            <Box sx={{ position: "relative" }}>
                <Honeypot />

                {!isAdminLogged && (
                    <Box
                        sx={fieldRowSx}
                        onMouseLeave={() => {
                            if (authorActivated) setAuthorShowErrors(true);
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
                            onChange={e => setAuthor(e.target.value)}
                            onFocus={() => setAuthorActivated(true)}
                            color="secondary"
                            sx={textFieldSx}
                        />

                        {authorShowErrors && validation.authorErrors.length > 0 && (
                            <Box mt={0.5}>
                                {validation.authorErrors.map(err => (
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
                    onMouseLeave={() => {
                        if (contentActivated) setContentShowErrors(true);
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
                        onChange={e => setContent(e.target.value)}
                        onFocus={() => setContentActivated(true)}
                        color="secondary"
                        sx={textFieldSx}
                    />
                </Box>

                {contentShowErrors && validation.contentErrors.length > 0 && (
                    <Box mt={0.5}>
                        {validation.contentErrors.map(err => (
                            <Typography key={err} variant="caption" color="error" display="block">
                                {errorMessages[err] ?? err}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Box display="flex" flexDirection={{ xs: "column-reverse", sm: "row" }} justifyContent={{ xs: "stretch", sm: "space-evenly" }} alignItems="center" gap={1} mt={1}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} disabled={baseDisabled || !validation.isValid} sx={submitButtonSx}>
                        {submitLabel}
                    </Button>

                    {onCancel && (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                resetForm();
                                onCancel();
                            }}
                            fullWidth
                            sx={{ flex: { sm: 1 }, minWidth: { sm: 140 } }}
                        >
                            Anuluj
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}
