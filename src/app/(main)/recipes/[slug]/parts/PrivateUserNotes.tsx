"use client";
import { useIsUserLogged } from "@/stores/useAdminStore";
import { Box, Typography } from "@mui/material";

interface PrivateUserNotesProps {
    notes: string;
}

export const PrivateUserNotes = ({ notes }: PrivateUserNotesProps) => {
    const isUserLogged = useIsUserLogged();

    if (!isUserLogged) return null;

    return (
        <Box mt={4}>
            <Typography variant="h5" align="center" gutterBottom>
                Twoje notatki
            </Typography>
            <Box mt={1}>{notes}</Box>
        </Box>
    );
};
