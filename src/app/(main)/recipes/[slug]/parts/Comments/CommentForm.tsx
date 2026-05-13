"use client";

import { useState } from "react";
import { Box, TextField, Button, Paper, FormLabel, Typography } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx, formLabelSx, fieldRowSx, errorBoxSx } from "./commentStyles";
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

    const authorErrorText = validation.authorErrors.map(e => errorMessages[e] ?? e).join(", ");

    const contentErrorText = validation.contentErrors.map(e => errorMessages[e] ?? e).join(", ");

    return (
        <Paper elevation={1} sx={paperSx}>
            <Box sx={{ position: "relative" }}>
                <Honeypot />

                {!isAdminLogged && (
                    <>
                        <Box
                            id="Author Text Field Row"
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
                                        "aria-invalid": validation.authorErrors.length > 0,
                                        "aria-describedby": "author-error",
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
                        </Box>
                        <Box id="Author Error Box" mt={0.5} sx={errorBoxSx}>
                            {authorShowErrors && validation.authorErrors.length > 0 ? (
                                <Typography variant="caption" color="error">
                                    {authorErrorText}
                                </Typography>
                            ) : (
                                <Typography variant="caption" sx={{ opacity: 0 }}>
                                    .
                                </Typography>
                            )}
                        </Box>
                    </>
                )}

                <Box
                    id=" Content Text Field Row"
                    sx={fieldRowSx}
                    onMouseLeave={() => {
                        if (contentActivated) setContentShowErrors(true);
                    }}
                >
                    <FormLabel id="Content Form Label" required sx={formLabelSx}>
                        Skomentuj
                    </FormLabel>

                    <TextField
                        slotProps={{
                            htmlInput: {
                                "aria-label": "Treść komentarza",
                                "aria-invalid": validation.contentErrors.length > 0,
                                "aria-describedby": "content-error",
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

                <Box id="Content Error Box" mt={0.5} sx={errorBoxSx}>
                    {contentShowErrors && validation.contentErrors.length > 0 ? (
                        <Typography variant="caption" color="error" id="content-error">
                            {contentErrorText}
                        </Typography>
                    ) : (
                        <Typography variant="caption" sx={{ opacity: 0 }}>
                            .
                        </Typography>
                    )}
                </Box>

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

// todo: focus MuiButton: {
//   styleOverrides: {
//     root: {
//       "&:focus-visible": {
//         outline: "3px solid #1976d2",
//         outlineOffset: 2,
//       },
//     },
//   },
// }
// Focus powinien:

// być grubszy niż border
// mieć kontrast min 3:1
// być widoczny w dark mode
