"use client";

import { Modal, Fade, Backdrop, Box, TextField, Button, Stack, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import useEscapeKey from "@/hooks/useEscapeKey";
import { useRouter } from "next/navigation";
import { recipeNotesModalStyles, modalStyles, visuallyHidden } from "./RecipeNotesModal.styles";
import { MAX_PRIVATE_NOTE_LENGTH } from "@/setup";
import { useApiResponseErrorHandler } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { deleteRecipeNote, saveRecipeNote } from "./RecipeNotesModal.api";
import { useRecipeNotesModalFocus } from "./useRecipeNotesModalFocus";

interface Props {
    open: boolean;
    onClose: () => void;
    initialValue?: string;
    recipeId: string;
}

export const NOTES_SAVE_STATUS_ID = "notes-save-status";

export const RecipeNotesModal = ({ open, onClose, initialValue = "", recipeId }: Props) => {
    const [notes, setNotes] = useState(initialValue);
    const [saving, setSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const textFieldRef = useRecipeNotesModalFocus(open);
    const router = useRouter();
    const prefersReducedMotion = useReducedMotion();
    const handleApiResponseError = useApiResponseErrorHandler();
    const handleClose = () => {
        setDeleteDialogOpen(false);
        onClose();
    };
    useEscapeKey(open, handleClose);

    //     if (!open) return;

    //     setNotes(initialValue);

    //     if (hasOpenedOnce.current) return;

    //     hasOpenedOnce.current = true;

    //     const timeoutId = setTimeout(() => {
    //         const input = textFieldRef.current;

    //         if (input) {
    //             input.focus();

    //             const length = input.value.length;
    //             input.setSelectionRange(length, length);
    //         }
    //     }, 100);

    //     return () => clearTimeout(timeoutId);
    // }, [open, initialValue]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value.slice(0, MAX_PRIVATE_NOTE_LENGTH);
        setNotes(value);
    };
    useEffect(() => {
        if (!open) return;

        setNotes(initialValue);
    }, [open, initialValue]);

    const handleSave = async () => {
        if (!recipeId) return;

        const sanitized = notes.trim();

        if (!sanitized) {
            alert("Notatka nie może być pusta!");
            return;
        }

        setSaving(true);

        try {
            await saveRecipeNote(recipeId, sanitized);
            router.refresh();
            handleClose();
        } catch (err) {
            handleApiResponseError(err, {
                EMPTY_NOTES: {
                    type: "warning",
                },

                RECIPE_NOT_FOUND: {
                    type: "warning",
                },

                MISSING_RECIPE_ID: {
                    type: "warning",
                },

                MISSING_USER: {
                    type: "warning",
                },
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!notes?.trim()) return;

        setSaving(true);

        try {
            await deleteRecipeNote(recipeId);
            router.refresh();
            handleClose();
        } catch (err) {
            handleApiResponseError(err, {
                NOTE_NOT_FOUND: {
                    type: "warning",
                },

                MISSING_RECIPE_ID: {
                    type: "warning",
                },

                MISSING_USER: {
                    type: "warning",
                },
            });
        } finally {
            setSaving(false);
        }
    };
    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    return (
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                disableAutoFocus
                disableEnforceFocus
                slotProps={{
                    backdrop: {
                        timeout: prefersReducedMotion ? 0 : 600,
                        sx: recipeNotesModalStyles.backdrop,
                    },
                }}
            >
                <Fade in={open} timeout={prefersReducedMotion ? 0 : 600}>
                    <Box sx={modalStyles} role="dialog" aria-modal="true" aria-labelledby="notes-modal-title" tabIndex={-1}>
                        <Box id="notes-modal-title" sx={visuallyHidden}>
                            Notatki do przepisu
                        </Box>

                        <Stack spacing={3}>
                            <TextField id=" TextField" label="Twoje notatki" multiline minRows={6} fullWidth value={notes} onChange={handleChange} inputRef={textFieldRef} />
                            <Box sx={recipeNotesModalStyles.counterText}>
                                {notes.length} /{MAX_PRIVATE_NOTE_LENGTH} znaków (pozostało {MAX_PRIVATE_NOTE_LENGTH - notes.length})
                            </Box>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button variant="contained" color="secondary" onClick={onClose} disabled={saving}>
                                    Anuluj
                                </Button>
                                <Box id={NOTES_SAVE_STATUS_ID} aria-live="polite" sx={visuallyHidden}>
                                    {saving ? "Notatka jest zapisywana" : "Możesz zapisać notatkę"}
                                </Box>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={openDeleteDialog}
                                    disabled={saving || !notes?.trim()} // opcjonalnie blokuj jeśli brak treści
                                >
                                    Usuń
                                </Button>
                                <Button variant="contained" onClick={handleSave} disabled={saving} aria-describedby={NOTES_SAVE_STATUS_ID} color="primary">
                                    {saving ? <CircularProgress size={20} color="inherit" /> : "Zapisz"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Usuń notatkę</DialogTitle>

                <DialogContent>
                    <DialogContentText>Czy na pewno chcesz usunąć tę notatkę?</DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={saving} color="secondary">
                        Anuluj
                    </Button>

                    <Button color="primary" variant="contained" onClick={handleDelete} disabled={saving}>
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RecipeNotesModal;
//todo kontynuować refaktor
