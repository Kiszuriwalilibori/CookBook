"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { containerStyles, textStyles } from "../../PrivateUserNotes.styles";
import { useIsUserSet } from "@/stores/userStore";
import { useApiResponseErrorHandler } from "@/hooks";
import { useNotesState } from "./useNotesState";
import { ApiResponse } from "@/models/apiResponse";

interface PrivateUserNotesProps {
    recipeId: string;
    initialNotes?: string;
}

export const PrivateUserNotes = ({ recipeId, initialNotes }: PrivateUserNotesProps) => {
    const hasUser = useIsUserSet();
    const { notes, setNotes, clearNotes, hasNotes } = useNotesState(initialNotes);
    const [loading, setLoading] = useState(false);
    const handleApiResponseError = useApiResponseErrorHandler();

    useEffect(() => {
        setNotes(initialNotes || "");
    }, [initialNotes]);

    useEffect(() => {
        if (!hasUser) {
            clearNotes();
            return;
        }

        setLoading(true);

        fetch(`/api/recipe-notes?recipeId=${recipeId}`)
            .then(res => res.json() as Promise<ApiResponse<{ notes: string }>>)
            .then(result => {
                if (result.ok) {
                    setNotes(result.data.notes);
                } else {
                    clearNotes();
                    handleApiResponseError(result.error, {
                        MISSING_USER: {
                            type: "warning",
                        },

                        MISSING_RECIPE_ID: {
                            type: "warning",
                        },
                    });
                }
            })
            .catch(err => {
                handleApiResponseError(err);
                clearNotes();
            })
            .finally(() => setLoading(false));
    }, [recipeId, hasUser]);

    if (!hasUser) return null;
    if (!hasNotes && !loading) return null;

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
export default PrivateUserNotes;
