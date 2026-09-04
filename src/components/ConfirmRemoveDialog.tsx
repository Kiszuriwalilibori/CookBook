"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Typography } from "@mui/material";

interface ConfirmRemoveDialogProps {
    open: boolean;
    loading: boolean;
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
    onExited: () => void;
}

export const ConfirmRemoveDialog: React.FC<ConfirmRemoveDialogProps> = ({ open, loading, title, onCancel, onConfirm, onExited }) => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            slots={{
                transition: Fade,
            }}
            slotProps={{
                transition: {
                    timeout: prefersReducedMotion ? 0 : 700,
                    onExited,
                },
            }}
        >
            <DialogTitle>Potwierdzenie usunięcia</DialogTitle>

            <DialogContent>
                <Typography>
                    Czy na pewno chcesz usunąć <strong>{title}</strong> z Ulubionych?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} disabled={loading} variant="contained" color="secondary">
                    Anuluj
                </Button>

                <Button onClick={onConfirm} disabled={loading} variant="contained" color="error">
                    {loading ? "Usuwanie..." : "Usuń"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmRemoveDialog;

//todo: tranzycja dodana i działa. Może być jednak potrzebna w innych modalach
