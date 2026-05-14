// ValidationErrorBox.tsx

import { Box, Typography } from "@mui/material";
import { errorBoxSx } from "./commentStyles";

type ValidationErrorBoxProps = {
    showErrors: boolean;
    hasErrors: boolean;
    errorText: string;
    id?: string;
};

export function ValidationErrorBox({ showErrors, hasErrors, errorText, id }: ValidationErrorBoxProps) {
    return (
        <Box mt={0.5} sx={errorBoxSx}>
            {showErrors && hasErrors ? (
                <Typography variant="caption" color="error" id={id}>
                    {errorText}
                </Typography>
            ) : (
                <Typography variant="caption" sx={{ opacity: 0 }}>
                    .
                </Typography>
            )}
        </Box>
    );
}
