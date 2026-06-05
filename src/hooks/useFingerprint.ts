"use client";

import { useEffect } from "react";
import { useFingerprintStore } from "@/stores";

export function useFingerprint(): string {
    const fingerprint = useFingerprintStore(s => s.fingerprint);
    const getFingerprint = useFingerprintStore(s => s.getFingerprint);
    const init = useFingerprintStore(s => s.init);

    useEffect(() => {
        init(); // Jednorazowa inicjalizacja po hydracji
    }, [init]);

    // Zwracamy to co jest w store (na serwerze będzie null → "")
    return fingerprint || getFingerprint();
}
