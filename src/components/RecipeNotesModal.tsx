"use client";

import { Modal, Fade, Backdrop, Box, TextField, Button, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import useEscapeKey from "@/hooks/useEscapeKey";
import { modalStyles, visuallyHidden } from "./Header/Header.styles";

interface Props {
    open: boolean;
    onClose: () => void;
    initialValue?: string;
    onSave?: (value: string) => void;
}

export const RecipeNotesModal = ({ open, onClose, initialValue = "", onSave }: Props) => {
    const [notes, setNotes] = useState(initialValue);

    useEscapeKey(open, onClose);

    useEffect(() => {
        if (open) {
            setNotes(initialValue);
        }
    }, [open, initialValue]);

    const handleSave = () => {
        onSave?.(notes);
        onClose();
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
                    sx: {
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            }}
        >
            <Fade in={open} timeout={600}>
                <Box sx={modalStyles} role="dialog" aria-modal="true" aria-labelledby="notes-modal-title" tabIndex={-1}>
                    <Box id="notes-modal-title" sx={visuallyHidden}>
                        Notatki do przepisu
                    </Box>

                    <Stack spacing={3}>
                        <TextField label="Twoje notatki" multiline minRows={6} fullWidth value={notes} onChange={e => setNotes(e.target.value)} autoFocus />

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={onClose}>
                                Anuluj
                            </Button>
                            <Button variant="contained" onClick={handleSave}>
                                Zapisz
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Fade>
        </Modal>
    );
};

export default RecipeNotesModal;
