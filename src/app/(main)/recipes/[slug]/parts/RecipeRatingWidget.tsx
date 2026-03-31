"use client";

import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { generateDeviceFingerprint, hashFingerprint } from "@/utils/fingerprint";
import type { RatingValue } from "@/types/recipeRatings";

interface RecipeRatingWidgetProps {
    recipeId: string;
    averageRating: number | null;
    totalRatings: number;
    raterName?: string;
}

export default function RecipeRatingWidget({ recipeId, averageRating, totalRatings, raterName = "Anonimowy" }: RecipeRatingWidgetProps) {
    const [rating, setRating] = useState<RatingValue | 0>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [fingerprintHash, setFingerprintHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Generuj fingerprint przy montowaniu
    useEffect(() => {
        const fingerprint = generateDeviceFingerprint();
        const hash = hashFingerprint(fingerprint);
        setFingerprintHash(hash);

        // Sprawdź czy użytkownik już ocenił
        const checkExistingRating = async (hashValue: string) => {
            try {
                const res = await fetch(`/api/recipe-ratings?recipeId=${recipeId}&action=check&fingerprintHash=${hashValue}`);

                if (res.status === 409) {
                    const data = await res.json();
                    setHasRated(true);
                    setRating(data.existingRating.rating);
                }
            } catch (err) {
                console.error("Error checking rating:", err);
            }
        };

        checkExistingRating(hash);
    }, [recipeId]);

    const handleRatingChange = async (newRating: number) => {
        if (!fingerprintHash) return;

        setRating(newRating as RatingValue);
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/recipe-ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeId,
                    rating: newRating,
                    raterName,
                    fingerprintHash,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setHasRated(true);
        } catch (err) {
            console.error("Error submitting rating:", err);
            setError("Błąd podczas zapisywania oceny");
        } finally {
            setIsLoading(false);
        }
    };

    const ratingsText = totalRatings === 1 ? "ocena" : totalRatings < 5 ? "oceny" : "ocen";

    return (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-gray-50">
            {/* Średnia ocena i liczba ocen */}
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

            {/* Gwiazdki i przycisk */}
            <div className="flex items-center gap-4">
                <div>
                    <ReactStars
                        count={5}
                        onChange={handleRatingChange}
                        size={32}
                        activeColor="#fbbf24"
                        color="#e5e7eb"
                        value={rating}
                        edit={!hasRated}
                        isHalf={false}
                        emptyIcon={<span className="text-2xl">★</span>}
                        halfIcon={<span className="text-2xl">★</span>}
                        filledIcon={<span className="text-2xl">★</span>}
                    />
                </div>

                {/* Status */}
                <div className="text-sm">{hasRated ? <span className="text-green-600 font-medium">✓ Dziękuję za ocenę!</span> : <span className="text-gray-500">Oceń!</span>}</div>
            </div>

            {/* Error message */}
            {error && <div className="text-xs text-red-600">{error}</div>}

            {/* Loading state */}
            {isLoading && <div className="text-xs text-blue-600">Zapisywanie...</div>}
        </div>
    );
}
