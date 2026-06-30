"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { containerStyles, textStyles } from "./PrivateUserNotes.styles";
import { useIsUserSet } from "@/stores/userStore";

interface PrivateUserNotesProps {
    recipeId: string;
    initialNotes?: string;
}

export const PrivateUserNotes = ({ recipeId, initialNotes }: PrivateUserNotesProps) => {
    const hasUser = useIsUserSet();
    const [notes, setNotes] = useState(initialNotes || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNotes(initialNotes || "");
    }, [initialNotes]);

    useEffect(() => {
        if (!hasUser) {
            setNotes("");
            return;
        }

        // 🔥 KLUCZOWE: zawsze fetch przy zmianie loginStatus
        setLoading(true);

        fetch(`/api/recipe-notes?recipeId=${recipeId}`)
            .then(res => res.json())
            .then(data => setNotes(data.notes || ""))
            .finally(() => setLoading(false));
    }, [recipeId, hasUser]);

    if (!hasUser) return null;
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
