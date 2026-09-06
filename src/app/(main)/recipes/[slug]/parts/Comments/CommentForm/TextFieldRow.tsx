import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { textFieldRowSx } from "./CommentFormParts.styles";

type TextFieldRowProps = {
    id: string;
    activated: boolean;
    onShowErrors: () => void;
    children: ReactNode;
    hint?: ReactNode;
};

export function TextFieldRow({ id, activated, onShowErrors, children, hint }: TextFieldRowProps) {
    return (
        <Box
            id={id}
            sx={textFieldRowSx}
            onMouseLeave={() => {
                if (activated) onShowErrors();
            }}
        >
            {children}
            {hint && (
                <>
                    <Box />
                    <Box>{hint}</Box>
                </>
            )}
        </Box>
    );
}
