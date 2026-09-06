"use client";

import { Button } from "@mui/material";
import { cancelButtonSx } from "./CommentFormParts.styles";

type Props = {
    onReset: () => void;
};

export function CommentFormCancelButton({ onReset }: Props) {
    return (
        <Button variant="contained" color="secondary" onClick={onReset} sx={cancelButtonSx}>
            Anuluj
        </Button>
    );
}
//todo nie wiadomo czy uzasadnione robienie z tego indyw. komp
