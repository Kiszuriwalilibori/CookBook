"use client";

import { Modal, Fade, Backdrop, Box, TextField, Button, Stack, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useEscapeKey from "@/hooks/useEscapeKey";
import { modalStyles, visuallyHidden } from "./Header/Header.styles";
import { useRouter } from "next/navigation";

interface Props {
    open: boolean;
    onClose: () => void;
    initialValue?: string;

    // nowe propsy dla integracji z API
    recipeId: string;
    userEmail: string;

    onSave?: (value: string) => void; // opcjonalny callback
}

export const RecipeNotesModal = ({ open, onClose, initialValue = "", recipeId, userEmail, onSave }: Props) => {
    const [notes, setNotes] = useState(initialValue);
    const [saving, setSaving] = useState(false);
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
    const router = useRouter();
    useEscapeKey(open, onClose);

    // reset notes przy otwarciu modala
    // useEffect(() => {
    //     if (open) {
    //         setNotes(initialValue);
    //     }
    // }, [open, initialValue]);
    useEffect(() => {
        if (!open) return;

        setNotes(initialValue);

        if (!hasOpenedOnce) {
            setHasOpenedOnce(true);

            // mały delay żeby poczekać na animację i render
            setTimeout(() => {
                const input = textFieldRef.current;

                if (input) {
                    input.focus();

                    // ustawienie kursora na końcu tekstu
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                }
            }, 100);
        }
    }, [open, initialValue, hasOpenedOnce]);

    // 🔹 Ograniczenie do 2000 znaków w stanie
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value.slice(0, 200); // max 2000 znaków
        setNotes(value);
    };
    const handleSave = async () => {
        if (!recipeId || !userEmail) return;
        const sanitized = notes.trim();
        if (!sanitized) {
            alert("Notatka nie może być pusta!");
            return;
        }

        setSaving(true);

        try {
            // zapis przez route /api/recipe-notes
            await fetch("/api/recipe-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipeId, notes: sanitized }),
            });
            router.refresh(); // 🔥 DODAJ TO
            // callback opcjonalny
            onSave?.(sanitized);
        } catch (err) {
            console.error("Nie udało się zapisać notatki:", err);
            alert("Nie udało się zapisać notatki. Spróbuj ponownie.");
        } finally {
            setSaving(false);
            onClose();
        }
    };

    const handleDelete = async () => {
        if (!notes?.trim()) return; // nie pozwalamy na delete pustej notatki
        const confirmDelete = confirm("Czy na pewno chcesz usunąć notatkę?");
        if (!confirmDelete) return;

        setSaving(true);
        try {
            await fetch(`/api/recipe-notes?recipeId=${recipeId}`, { method: "DELETE" });
            onSave?.("");
            router.refresh();
            onClose();
        } catch (err) {
            console.error("Nie udało się usunąć notatki:", err);
            alert("Nie udało się usunąć notatki. Spróbuj ponownie.");
        } finally {
            setSaving(false);
        }
    };
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 600,
                    sx: { bgcolor: "rgba(0,0,0,0.5)" },
                },
            }}
        >
            <Fade in={open} timeout={600}>
                <Box sx={modalStyles} role="dialog" aria-modal="true" aria-labelledby="notes-modal-title" tabIndex={-1}>
                    <Box id="notes-modal-title" sx={visuallyHidden}>
                        Notatki do przepisu
                    </Box>

                    <Stack spacing={3}>
                        <TextField label="Twoje notatki" multiline minRows={6} fullWidth value={notes} onChange={handleChange} inputRef={textFieldRef} />
                        <Box sx={{ fontSize: "0.875rem", color: "text.secondary", textAlign: "right" }}>
                            {notes.length} / 200 znaków (pozostało {200 - notes.length})
                        </Box>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onClose} disabled={saving}>
                                Anuluj
                            </Button>
                            <Box id="notes-save-status" aria-live="polite" sx={visuallyHidden}>
                                {saving ? "Notatka jest zapisywana" : "Możesz zapisać notatkę"}
                            </Box>
                            <Button variant="contained" onClick={handleSave} disabled={saving} aria-describedby="notes-save-status">
                                {saving ? <CircularProgress size={20} color="inherit" /> : "Zapisz"}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                                disabled={saving || !notes?.trim()} // opcjonalnie blokuj jeśli brak treści
                            >
                                Usuń
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
};

export default RecipeNotesModal;

// todo: notes-save-status do stałej dla skalowalności
