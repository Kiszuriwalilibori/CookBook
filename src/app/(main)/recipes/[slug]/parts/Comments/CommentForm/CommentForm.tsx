"use client";

import { RefObject, useState } from "react";

import { Box, TextField, Button, Paper, FormLabel, FormControlLabel, Checkbox, Collapse } from "@mui/material";

import { useIsAdminLogged } from "@/stores";

import { Honeypot } from "./Honeypot";
import { ValidationErrorBox } from "./ValidationErrorBox";
import { TextFieldRow } from "./TextFieldRow";
import { CommentFormCancelButton } from "./CommentFormCancelButton";

import { useMessage } from "@/hooks";

import { validateComment } from "./validateComment";
import { errorMessages } from "./errorMessages";

import { actionsBoxSx, characterHintSx, collapseSx, formLabelSx, paperSx, submitButtonSx, textFieldSx } from "./CommentForm.styles";

export interface CommentFormProps {
    /** Ref do pola tekstowego (używany m.in. do focusa po błędzie) */
    textAreaRef?: React.RefObject<HTMLTextAreaElement | null> | null;

    /** Określa czy formularz jest aktualnie rozwinięty */
    isFormOpen?: boolean;

    /** Ref do kontenera formularza (używany przez mechanizm scroll/focus) */
    formContainerRef?: RefObject<HTMLDivElement | null>;

    /** Funkcja wywoływana po poprawnym przesłaniu formularza */
    onSubmitNormalComment: (data: { author: string; content: string; website?: string }) => Promise<void>;

    onSubmitShortComment?: (data: { commentId: string; shortContent: string }) => Promise<boolean>;

    /** Etykieta przycisku wysyłania */
    submitLabel?: string;

    /** Opcjonalna funkcja cancel (np. zamykanie formularza odpowiedzi) */
    onCancel?: () => void;

    commentId?: string;

    /**
     * Tryb używany dla formularza nowego komentarza
     * renderowanego wewnątrz Dialog.
     */
    renderAsModal?: boolean;
}

export default function CommentForm({ textAreaRef, formContainerRef, commentId, isFormOpen = true, onSubmitNormalComment, onSubmitShortComment, submitLabel = "Dodaj", onCancel, renderAsModal = false }: CommentFormProps) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const [authorShowErrors, setAuthorShowErrors] = useState(false);
    const [contentShowErrors, setContentShowErrors] = useState(false);

    const [authorActivated, setAuthorActivated] = useState(false);
    const [contentActivated, setContentActivated] = useState(false);

    const [isShortComment, setIsShortComment] = useState(false);

    const showMessage = useMessage();

    const isAdminLogged = useIsAdminLogged();

    const isShortCommentModeAvailable = !!commentId;

    // Single source of truth for validation
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
        setIsShortComment(false);
    }

    function handleReset() {
        resetForm();
        onCancel?.();
    }

    async function handleSubmitShortComment() {
        if (!onSubmitShortComment) {
            showMessage.error("Błąd techniczny: funkcja short comment nie jest dostępna w tym kontekście.");
            return;
        }

        if (!commentId) {
            showMessage.error("Short comment można dodawać tylko do istniejącego komentarza.");
            return;
        }

        const result = validateComment({
            author: isAdminLogged ? "Piotr" : author.trim(),
            content,
        });

        if (!result.isValid) {
            setContentShowErrors(true);
            return;
        }

        handleReset();

        const success = await onSubmitShortComment({
            commentId,
            shortContent: content,
        });

        if (success) {
            handleReset();
            setIsShortComment(false);
        }
    }

    async function handleSubmitNormalComment() {
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

        const honeypotInput = document.querySelector('input[name="website"]') as HTMLInputElement;

        const websiteValue = honeypotInput?.value?.trim() || "";

        await onSubmitNormalComment({
            author: finalAuthor,
            content,
            website: websiteValue,
        });

        resetForm();
    }

    const baseDisabled = !content.trim() || (!isAdminLogged && !author.trim());

    const authorErrorText = validation.authorErrors.map(error => errorMessages[error] ?? error).join(", ");

    const contentErrorText = validation.contentErrors.map(error => errorMessages[error] ?? error).join(", ");

    const formContent = (
        <Box sx={{ position: "relative" }}>
            <Honeypot />

            {!isAdminLogged && (
                <>
                    <TextFieldRow id="Author Text Field Row" activated={authorActivated} onShowErrors={() => setAuthorShowErrors(true)} hint={<Box sx={characterHintSx}>2–40 znaków</Box>}>
                        <FormLabel required sx={formLabelSx} htmlFor="comment-author">
                            Przedstaw się
                        </FormLabel>

                        <Box>
                            <TextField
                                id="comment-author"
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
                                placeholder="np.: Anulka"
                                value={author}
                                onChange={e => setAuthor(e.target.value)}
                                onFocus={() => setAuthorActivated(true)}
                                color="secondary"
                                sx={textFieldSx}
                            />
                        </Box>
                    </TextFieldRow>

                    <ValidationErrorBox showErrors={authorShowErrors} hasErrors={validation.authorErrors.length > 0} errorText={authorErrorText} id="author-error" />
                </>
            )}

            <TextFieldRow id="Content Text Field Row" activated={contentActivated} onShowErrors={() => setContentShowErrors(true)} hint={<Box sx={characterHintSx}>3–1000 znaków</Box>}>
                <FormLabel id="Content Form Label" required sx={formLabelSx} htmlFor="comment-content">
                    Skomentuj
                </FormLabel>

                <Box>
                    <TextField
                        id="comment-content"
                        slotProps={{
                            htmlInput: {
                                "aria-label": "Treść komentarza",
                                "aria-invalid": validation.contentErrors.length > 0,
                                "aria-describedby": "content-error",
                            },
                        }}
                        fullWidth
                        multiline
                        data-autofocus
                        autoComplete="off"
                        minRows={3}
                        size="small"
                        placeholder="Napisz coś"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        onFocus={() => setContentActivated(true)}
                        color="secondary"
                        sx={textFieldSx}
                    />

                    {/* <Box sx={characterHintSx}>3–1000 znaków</Box> */}
                </Box>
            </TextFieldRow>

            <ValidationErrorBox showErrors={contentShowErrors} hasErrors={validation.contentErrors.length > 0} errorText={contentErrorText} id="content-error" />

            {isAdminLogged && isShortCommentModeAvailable && (
                <Box sx={{ mt: 1, mb: 2 }}>
                    <FormControlLabel control={<Checkbox checked={isShortComment} onChange={e => setIsShortComment(e.target.checked)} color="primary" />} label="To jest krótki komentarz" />
                </Box>
            )}

            <Box sx={actionsBoxSx}>
                {onCancel && <CommentFormCancelButton onReset={handleReset} />}

                <Button color="primary" variant="contained" onClick={isShortComment ? handleSubmitShortComment : handleSubmitNormalComment} disabled={baseDisabled || !validation.isValid} sx={submitButtonSx}>
                    {submitLabel}
                </Button>
            </Box>
        </Box>
    );

    // Formularz nowego komentarza:
    // Dialog jest jego zewnętrznym kontenerem, więc nie używamy
    // Collapse ani Paper.
    if (renderAsModal) {
        return formContent;
    }

    // Formularz odpowiedzi:
    // zachowujemy dotychczasowy mechanizm Collapse + Paper.
    return (
        <Box ref={formContainerRef}>
            <Collapse in={isFormOpen} timeout={400} sx={collapseSx} id="collapse">
                <Paper elevation={1} sx={paperSx} id="paper">
                    {formContent}
                </Paper>
            </Collapse>
        </Box>
    );
}
