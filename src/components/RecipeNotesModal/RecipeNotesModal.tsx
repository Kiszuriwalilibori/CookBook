"use client";

import { Modal, Fade, Backdrop, Box, TextField, Button, Stack, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useEscapeKey from "@/hooks/useEscapeKey";
import { useRouter } from "next/navigation";
import { recipeNotesModalStyles, modalStyles, visuallyHidden } from "./RecipeNotesModal.styles";
import { MAX_PRIVATE_NOTE_LENGTH } from "@/setup";
import { useApiResponseErrorHandler } from "@/hooks";
import { ApiResponse } from "@/models/apiResponse";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

    const router = useRouter();
    const prefersReducedMotion = useReducedMotion();
    const handleApiResponseError = useApiResponseErrorHandler();
    const handleClose = () => {
        setDeleteDialogOpen(false);
        onClose();
    };
    useEscapeKey(open, handleClose);

    // useEffect(() => {
    //     if (!open) return;

    //     setNotes(initialValue);

    //     if (!hasOpenedOnce) {
    //         setHasOpenedOnce(true);

    //         // mały delay żeby poczekać na animację i render
    //         setTimeout(() => {
    //             const input = textFieldRef.current;

    //             if (input) {
    //                 input.focus();

    //                 // ustawienie kursora na końcu tekstu
    //                 const length = input.value.length;
    //                 input.setSelectionRange(length, length);
    //             }
    //         }, 100);
    //     }
    // }, [open, initialValue, hasOpenedOnce]);
    useEffect(() => {
        if (!open) return;

        setNotes(initialValue);

        if (!hasOpenedOnce) {
            setHasOpenedOnce(true);

            const timeoutId = setTimeout(() => {
                const input = textFieldRef.current;

                if (input) {
                    input.focus();
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [open, initialValue, hasOpenedOnce]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value.slice(0, MAX_PRIVATE_NOTE_LENGTH);
        setNotes(value);
    };

    const handleSave = async () => {
        if (!recipeId) return;

        const sanitized = notes.trim();

        if (!sanitized) {
            alert("Notatka nie może być pusta!");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch("/api/recipe-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipeId, notes: sanitized }),
            });

            const result: ApiResponse<null> = await response.json();

            if (!result.ok) {
                throw result.error;
            }

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
            // onClose();
        }
    };

    const handleDelete = async () => {
        if (!notes?.trim()) return;

        setSaving(true);

        try {
            const response = await fetch(`/api/recipe-notes?recipeId=${recipeId}`, {
                method: "DELETE",
            });

            const result: ApiResponse<null> = await response.json();

            if (!result.ok) {
                throw result.error;
            }

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
                            <TextField label="Twoje notatki" multiline minRows={6} fullWidth value={notes} onChange={handleChange} inputRef={textFieldRef} />
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
                                <Button variant="contained" onClick={handleSave} disabled={saving} aria-describedby={NOTES_SAVE_STATUS_ID} color="primary">
                                    {saving ? <CircularProgress size={20} color="inherit" /> : "Zapisz"}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={openDeleteDialog}
                                    disabled={saving || !notes?.trim()} // opcjonalnie blokuj jeśli brak treści
                                >
                                    Usuń
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

// todo rzuca błędy ## Invalid prop `tabIndex` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.
// todo poza tym, jeżeli w poprzednim ruchu usunęliśmy notatkę, to po ponownym wejściu w edytuj notatke od razu włącza się modal Usuń notatkę Czy na pewno chcesz usunąć tę notatkę?
