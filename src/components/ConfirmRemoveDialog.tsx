"use client";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface ConfirmRemoveDialogProps {
    open: boolean;
    title: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmRemoveDialog({ open, title, loading = false, onConfirm, onCancel }: ConfirmRemoveDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Usunąć z Ulubionych?</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Czy na pewno chcesz usunąć
                    <strong> {title}</strong> z Ulubionych?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>Anuluj</Button>

                <Button color="error" variant="contained" disabled={loading} onClick={onConfirm}>
                    Usuń
                </Button>
            </DialogActions>
        </Dialog>
    );
}
