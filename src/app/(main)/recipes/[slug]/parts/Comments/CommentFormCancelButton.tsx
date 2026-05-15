"use client";

import { Button } from "@mui/material";
import { cancelButtonSx } from "./commentStyles";

type Props = {
    onReset: () => void;
};

export function CommentFormCancelButton({ onReset }: Props) {
    return (
        <Button variant="contained" color="warning" onClick={onReset} fullWidth sx={cancelButtonSx}>
            Anuluj
        </Button>
    );
}
