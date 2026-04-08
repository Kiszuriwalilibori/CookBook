"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useIsUserLogged, useLoginStatus } from "@/stores/useAdminStore";
import { containerStyles, textStyles } from "./PrivateUserNotes.styles";

interface PrivateUserNotesProps {
    recipeId: string;
    userEmail?: string;
    initialNotes?: string;
}

export const PrivateUserNotes = ({ recipeId, userEmail, initialNotes }: PrivateUserNotesProps) => {
    const isUserLogged = useIsUserLogged();
    const loginStatus = useLoginStatus();

    const [notes, setNotes] = useState(initialNotes || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNotes(initialNotes || "");
    }, [initialNotes]);

    useEffect(() => {
        if (!isUserLogged || !userEmail) {
            setNotes("");
            return;
        }

        // 🔥 KLUCZOWE: zawsze fetch przy zmianie loginStatus
        setLoading(true);

        fetch(`/api/recipe-notes?recipeId=${recipeId}`)
            .then(res => res.json())
            .then(data => setNotes(data.notes || ""))
            .finally(() => setLoading(false));
    }, [recipeId, userEmail, loginStatus, isUserLogged]);

    if (!isUserLogged) return null;
    if (!notes?.trim() && !loading) return null;

    return (
        <Box sx={containerStyles}>
            <Typography variant="h5" align="center" gutterBottom>
                Twoje notatki
            </Typography>

            <Typography variant="body1" sx={textStyles}>
                {loading ? "Ładowanie…" : notes}
            </Typography>
        </Box>
    );
};
