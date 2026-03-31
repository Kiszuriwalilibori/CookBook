import { useEffect, useState } from "react";
import { generateDeviceFingerprint, hashFingerprint } from "@/utils/fingerprint";

export function useFingerprint() {
    const [fingerprintHash, setFingerprintHash] = useState<string | null>(null);

    useEffect(() => {
        const fingerprint = generateDeviceFingerprint();
        const hash = hashFingerprint(fingerprint);
        setFingerprintHash(hash);
    }, []);

    return fingerprintHash;
}
