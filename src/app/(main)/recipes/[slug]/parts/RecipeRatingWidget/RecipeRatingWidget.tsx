"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography, CircularProgress } from "@mui/material";
import ReactStars from "react-rating-stars-component";
import type { ApiResponse } from "@/models/apiResponse";
import type { RatingValue, RatingPayload, RatingMutationResult } from "@/types/recipeRatings";
import { useApiResponseErrorHandler, useFingerprint } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { getRatingsText } from "./getRatingText";

import { containerSx, textSx, averageSx, countSx, successSx, loaderContainerSx } from "./recipeRatingWidget.styles";

interface RecipeRatingWidgetProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
    onRatingUpdated?: () => Promise<void>;
}

export function RecipeRatingWidget({ recipeId, averageRating, totalRatings, onRatingUpdated }: RecipeRatingWidgetProps) {
    const [rating, setRating] = useState<RatingValue | 0>(0);
    const [isLoading, setIsLoading] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const handleApiResponseError = useApiResponseErrorHandler();

    const [showThanks, setShowThanks] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [existingRating, setExistingRating] = useState<{ rating: number; updatedAt: string } | null>(null);
    const [pendingRating, setPendingRating] = useState<RatingValue | null>(null);

    const showTemporaryMessage = (text: string) => {
        setMessage(text);
        setShowThanks(true);

        setTimeout(() => {
            setShowThanks(false);
            setMessage(null);
        }, 5000);
    };

    const fingerprintHash = useFingerprint();

    const submitRating = async (newRating: RatingValue, overwrite = false) => {
        if (!fingerprintHash) return;
        setIsLoading(true);

        try {
            const payload: RatingPayload = {
                recipeId,
                rating: newRating,
                fingerprint: fingerprintHash,
                overwrite,
            };

            const res = await fetch("/api/recipe-ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data: ApiResponse<RatingMutationResult> = await res.json();
            if (!data.ok) {
                handleApiResponseError(data.error);
                return;
            }

            if (data.data.status === "exists") {
                setExistingRating(data.data.existingRating);
                setPendingRating(newRating);
                setShowOverwriteDialog(true);
                return;
            }

            if (data.data.status === "noChange") {
                showTemporaryMessage("Nie zmieniono oceny");
                return;
            }

            if (data.data.status === "updated") {
                await onRatingUpdated?.();
                setHasInteracted(false);
                showTemporaryMessage("Dziękuję za ocenę!");
                return;
            }
        } catch (err) {
            handleApiResponseError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingChange = (newRating: number) => {
        const value = newRating as RatingValue;
        setRating(value);
        setHasInteracted(true);
        submitRating(value);
    };

    const handleOverwriteConfirm = () => {
        if (pendingRating !== null) {
            submitRating(pendingRating, true);
            setShowOverwriteDialog(false);
            setPendingRating(null);
            setExistingRating(null);
        }
    };

    const handleOverwriteCancel = () => {
        setShowOverwriteDialog(false);
        setPendingRating(null);
        setExistingRating(null);
    };

    const ratingsText = getRatingsText(totalRatings);
    const hasRated = !!existingRating || hasInteracted;

    return (
        <Box sx={containerSx}>
            <Typography sx={textSx}>
                {averageRating !== null ? (
                    <>
                        Średnia{" "}
                        <Box component="span" sx={averageSx}>
                            {averageRating}
                        </Box>{" "}
                        / 5{" "}
                        <Box component="span" sx={countSx}>
                            ({totalRatings} {ratingsText})
                        </Box>
                    </>
                ) : (
                    "Brak ocen - bądź pierwszy!"
                )}
            </Typography>

            <ReactStars
                key={`${averageRating}-${hasInteracted}`}
                count={5}
                onChange={handleRatingChange}
                size={32}
                activeColor="#fbbf24"
                color="#e5e7eb"
                value={hasInteracted ? rating : (averageRating ?? 0)}
                edit={!isLoading}
                isHalf={false}
                emptyIcon={<span style={{ fontSize: 24 }}>★</span>}
                halfIcon={<span style={{ fontSize: 24 }}>★</span>}
                filledIcon={<span style={{ fontSize: 24 }}>★</span>}
            />

            {!hasRated && <Typography sx={textSx}>Oceń</Typography>}
            {isLoading && (
                <Box sx={loaderContainerSx}>
                    <CircularProgress size={20} color="primary" />
                </Box>
            )}

            {/* {error && <Typography sx={errorSx}>{error}</Typography>} */}
            {showThanks && <Typography sx={successSx}>✓ {message}</Typography>}

            <Dialog
                open={showOverwriteDialog}
                onClose={handleOverwriteCancel}
                slotProps={{
                    transition: {
                        timeout: prefersReducedMotion ? 0 : 700,
                    },
                }}
            >
                <DialogTitle>Już oceniałeś ten przepis</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Oceniałeś już ten przepis dnia {existingRating ? new Date(existingRating.updatedAt).toLocaleDateString() : ""}, wystawiłeś {existingRating?.rating}⭐. Czy chcesz zmienić swoją ocenę na {pendingRating}⭐?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleOverwriteCancel} disableFocusRipple>
                        Nie, zostaw starą ocenę
                    </Button>
                    <Button variant="contained" onClick={handleOverwriteConfirm} autoFocus disableFocusRipple>
                        Tak, zmień ocenę
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RecipeRatingWidget;
