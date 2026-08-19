"use client";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from "@mui/material";

interface ConfirmRemoveDialogProps {
    open: boolean;
    loading: boolean;
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
    onExited: () => void;
}

export const ConfirmRemoveDialog: React.FC<ConfirmRemoveDialogProps> = ({ open, loading, title, onCancel, onConfirm, onExited }) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            slots={{
                transition: Slide,
            }}
            slotProps={{
                transition: {
                    direction: "up",
                    timeout: {
                        enter: 400,
                        exit: 350,
                    },
                    easing: {
                        enter: "cubic-bezier(0.22, 1, 0.36, 1)",
                        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
                    },
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
