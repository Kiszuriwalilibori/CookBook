"use client";

import { useState } from "react";
import { Box, TextField, Button, Paper, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { useIsAdminLogged } from "@/stores";
import { errorMessages, validateComment } from "./utils";
import { paperSx, textFieldSx, submitButtonSx, formLabelSx, actionsBoxSx } from "./commentStyles";
import { Honeypot } from "./Honeypot";
import { ValidationErrorBox } from "./ValidationErrorBox";
import { TextFieldRow } from "./TextFieldRow";
import { CommentFormCancelButton } from "./CommentFormCancelButton";

export default function CommentForm({ textAreaRef, onSubmit, submitLabel = "Dodaj", onCancel }: { textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null; onSubmit: (data: { author: string; content: string }) => Promise<void>; submitLabel?: string; onCancel?: () => void }) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const [authorShowErrors, setAuthorShowErrors] = useState(false);
    const [contentShowErrors, setContentShowErrors] = useState(false);

    const [authorActivated, setAuthorActivated] = useState(false);
    const [contentActivated, setContentActivated] = useState(false);
    const [isShortComment, setIsShortComment] = useState(false);

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
    function handleReset() {
        resetForm();
        onCancel?.();
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
                        <TextFieldRow id="Author Text Field Row" activated={authorActivated} onShowErrors={() => setAuthorShowErrors(true)}>
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
                                helperText="2–40 znaków"
                                fullWidth
                                size="small"
                                placeholder="np.: Anulka"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                onFocus={() => setAuthorActivated(true)}
                                color="secondary"
                                sx={textFieldSx}
                            />
                        </TextFieldRow>
                        <ValidationErrorBox showErrors={authorShowErrors} hasErrors={validation.authorErrors.length > 0} errorText={authorErrorText} id="author-error" />
                    </>
                )}

                <TextFieldRow id="Content Text Field Row" activated={contentActivated} onShowErrors={() => setContentShowErrors(true)}>
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
                        multiline // niszczy focusa
                        autoComplete="off"
                        minRows={3} // todo niszczy focusa
                        size="small"
                        placeholder="Napisz coś"
                        helperText="3–1000 znaków"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onFocus={() => setContentActivated(true)}
                        color="secondary"
                        sx={textFieldSx}
                    />
                </TextFieldRow>
                <ValidationErrorBox showErrors={contentShowErrors} hasErrors={validation.contentErrors.length > 0} errorText={contentErrorText} id="content-error" />
                <Box sx={{ mt: 1, mb: 2 }}>
                    <FormControlLabel control={<Checkbox checked={isShortComment} onChange={e => setIsShortComment(e.target.checked)} color="secondary" />} label="To jest krótki komentarz" />
                </Box>
                <Box sx={actionsBoxSx}>
                    <Button fullWidth variant="contained" onClick={handleSubmit} disabled={baseDisabled || !validation.isValid} sx={submitButtonSx}>
                        {submitLabel}
                    </Button>
                    {onCancel && <CommentFormCancelButton onReset={handleReset} />}
                </Box>
            </Box>
        </Paper>
    );
}
