"use client";

import { Button } from "@mui/material";
import { cancelButtonSx } from "./commentStyles";

type Props = {
    onReset: () => void;
};

export function CommentFormCancelButton({ onReset }: Props) {
    return (
        <Button disableRipple variant="contained" color="secondary" onClick={onReset} fullWidth sx={cancelButtonSx}>
            Anuluj
        </Button>
    );
}
//todo nie wiadomo czy uzasadnione robienie z tego indyw. komp
