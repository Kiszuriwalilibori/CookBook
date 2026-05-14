// TextFieldRow.tsx

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { fieldRowSx } from "./commentStyles";

type TextFieldRowProps = {
    id: string;
    activated: boolean;
    onShowErrors: () => void;
    children: ReactNode;
};

export function TextFieldRow({ id, activated, onShowErrors, children }: TextFieldRowProps) {
    return (
        <Box
            id={id}
            sx={fieldRowSx}
            onMouseLeave={() => {
                if (activated) onShowErrors();
            }}
        >
            {children}
        </Box>
    );
}
