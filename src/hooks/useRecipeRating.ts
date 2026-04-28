"use client";

import { generateDeviceFingerprint, hashFingerprint } from "@/utils/fingerprint";
import { useEffect, useState } from "react";

export function useRecipeRating() {
    const [fingerprintHash, setFingerprintHash] = useState<string | null>(null);

    useEffect(() => {
        const fingerprint = generateDeviceFingerprint();
        const hash = hashFingerprint(fingerprint);
        setFingerprintHash(hash);
    }, []);

    const submitRating = async (recipeId: string, rating: number, raterName: string) => {
        if (!fingerprintHash) throw new Error("Fingerprint not ready");

        const res = await fetch("/api/recipe-ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId, rating, raterName, fingerprintHash }),
        });

        return res.json();
    };

    return { submitRating, fingerprintHash };
}
