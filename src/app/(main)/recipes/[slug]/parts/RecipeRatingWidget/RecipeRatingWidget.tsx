
"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography } from "@mui/material";
import ReactStars from "react-rating-stars-component";

import type { RatingValue, RatingPayload } from "@/types/recipeRatings";
import { useFingerprint } from "./useFingerprint";
import { getRatingsText } from "./getRatingText";

import { containerSx, textSx, averageSx, countSx, loadingSx, errorSx, successSx } from "./recipeRatingWidget.styles";

interface RecipeRatingWidgetProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
    onRatingUpdated?: () => void;
}

export function RecipeRatingWidget({ recipeId, averageRating, totalRatings, onRatingUpdated }: RecipeRatingWidgetProps) {
    const [rating, setRating] = useState<RatingValue | 0>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showThanks, setShowThanks] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [existingRating, setExistingRating] = useState<{ rating: number; updatedAt: string } | null>(null);
    const [pendingRating, setPendingRating] = useState<RatingValue | null>(null);

    const fingerprintHash = useFingerprint();

    const submitRating = async (newRating: RatingValue, overwrite = false) => {
        if (!fingerprintHash) return;

        setIsLoading(true);
        setError(null);

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

            const data = await res.json();

            if (res.status === 409) {
                setExistingRating(data.existingRating);
                setPendingRating(newRating);
                setShowOverwriteDialog(true);
                return;
            }

            if (data.status === "noChange") {
                setMessage("Nie zmieniono oceny");
                setShowThanks(true);
                setTimeout(() => {
                    setShowThanks(false);
                    setMessage(null);
                }, 3000);
                return;
            }

            onRatingUpdated?.();

            setMessage("Dziękuję za ocenę!");
            setShowThanks(true);
            setTimeout(() => {
                setShowThanks(false);
                setMessage(null);
            }, 3000);
        } catch (err) {
            console.error("Error submitting rating:", err);
            setError("Błąd podczas zapisywania oceny");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingChange = (newRating: number) => {
        submitRating(newRating as RatingValue);
    };

    const handleOverwriteConfirm = () => {
        if (pendingRating !== null) {
            submitRating(pendingRating, true);

            setShowOverwriteDialog(false);
            setPendingRating(null);
            setExistingRating(null);
            setRating(pendingRating);
        }
    };

    const handleOverwriteCancel = () => {
        setShowOverwriteDialog(false);
        setPendingRating(null);
        setExistingRating(null);
    };

    const ratingsText = getRatingsText(totalRatings);

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
                count={5}
                onChange={handleRatingChange}
                size={32}
                activeColor="#fbbf24"
                color="#e5e7eb"
                value={rating}
                edit={true}
                isHalf={false}
                emptyIcon={<span style={{ fontSize: 24 }}>★</span>}
                halfIcon={<span style={{ fontSize: 24 }}>★</span>}
                filledIcon={<span style={{ fontSize: 24 }}>★</span>}
            />

            {isLoading && <Typography sx={loadingSx}>Zapisywanie...</Typography>}
            {error && <Typography sx={errorSx}>{error}</Typography>}
            {showThanks && <Typography sx={successSx}>✓ {message}</Typography>}

            <Dialog open={showOverwriteDialog} onClose={handleOverwriteCancel}>
                <DialogTitle>Już oceniałeś ten przepis</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Oceniałeś już ten przepis dnia {existingRating ? new Date(existingRating.updatedAt).toLocaleDateString() : ""}, wystawiłeś {existingRating?.rating}⭐. Czy chcesz zmienić swoją ocenę na {pendingRating}⭐?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOverwriteCancel}>Nie, zostaw starą ocenę</Button>
                    <Button onClick={handleOverwriteConfirm} autoFocus>
                        Tak, zmień ocenę
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RecipeRatingWidget;
