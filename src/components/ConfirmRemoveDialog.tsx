"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmRemoveDialogProps {
    open: boolean;
    loading: boolean;
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmRemoveDialog: React.FC<ConfirmRemoveDialogProps> = ({ open, loading, title, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
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
