"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ReactStars from "react-rating-stars-component";

import type { RatingValue, RatingPayload } from "@/types/recipeRatings";
import { useFingerprint } from "./useFingerprint";
import { getRatingsText } from "./getRatingText";

interface RecipeRatingWidgetProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
}

export function RecipeRatingWidget({ recipeId, averageRating, totalRatings }: RecipeRatingWidgetProps) {
    const [rating, setRating] = useState<RatingValue | 0>(0);
    const [isLoading, setIsLoading] = useState(false);
    // const [fingerprintHash, setFingerprintHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showThanks, setShowThanks] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    // Modal do potwierdzenia nadpisania oceny
    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [existingRating, setExistingRating] = useState<{ rating: number; updatedAt: string } | null>(null);
    const [pendingRating, setPendingRating] = useState<RatingValue | null>(null);
    const fingerprintHash = useFingerprint();
    // useEffect(() => {
    //     const fingerprint = generateDeviceFingerprint();
    //     const hash = hashFingerprint(fingerprint);
    //     setFingerprintHash(hash);
    // }, []);

    const submitRating = async (newRating: RatingValue, overwrite = false) => {
        if (!fingerprintHash) return;

        setIsLoading(true);
        setError(null);

        try {
            const payload: RatingPayload = { recipeId, rating: newRating, fingerprint: fingerprintHash, overwrite };
            const res = await fetch("/api/recipe-ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.status === 409) {
                // Istnieje ocena → pokaż modal z opcją nadpisania
                setExistingRating(data.existingRating);
                setPendingRating(newRating);
                setShowOverwriteDialog(true);
                return;
            }

            // Obsługa "nowa ocena = stara ocena"

            if (data.status === "noChange") {
                setMessage("Nie zmieniono oceny");
                setShowThanks(true);
                setTimeout(() => {
                    setShowThanks(false);
                    setMessage(null);
                }, 3000);
                return;
            }
            // Aktualizacja stanu po udanej zmianie lub nowej ocenie

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
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 3000);
        }
    };

    const handleOverwriteCancel = () => {
        setShowOverwriteDialog(false);
        setPendingRating(null);
        setExistingRating(null);
    };
    const ratingsText = getRatingsText(totalRatings);

    return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50">
            {/* Średnia ocena */}
            <div className="text-sm text-gray-600">
                {averageRating !== null ? (
                    <span>
                        Średnia <strong className="text-lg text-gray-900">{averageRating}</strong> / 5{" "}
                        <strong className="text-gray-700">
                            ({totalRatings} {ratingsText})
                        </strong>
                    </span>
                ) : (
                    <span>Brak ocen - bądź pierwszy!</span>
                )}
            </div>

            {/* Gwiazdki */}
            <div className="flex items-center gap-4">
                <ReactStars
                    count={5}
                    onChange={handleRatingChange}
                    size={32}
                    activeColor="#fbbf24"
                    color="#e5e7eb"
                    value={rating}
                    edit={true}
                    isHalf={false}
                    emptyIcon={<span className="text-2xl">★</span>}
                    halfIcon={<span className="text-2xl">★</span>}
                    filledIcon={<span className="text-2xl">★</span>}
                />
                {isLoading && <span className="text-xs text-blue-600">Zapisywanie...</span>}
                {error && <span className="text-xs text-red-600">{error}</span>}
                {showThanks && <span className="text-xs text-green-600 font-medium">✓ {message}</span>}
            </div>

            {/* Modal nadpisania */}
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
        </div>
    );
}

export default RecipeRatingWidget;
