import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { generateDeviceFingerprint, hashFingerprint } from "@/utils/fingerprint";

interface FingerprintState {
    fingerprint: string | null;
    initialized: boolean;

    init: () => void;
    getFingerprint: () => string;
}

export const useFingerprintStore = create<FingerprintState>()(
    persist(
        (set, get) => ({
            fingerprint: null,
            initialized: false,

            init: () => {
                if (typeof window === "undefined") return;

                const state = get();
                if (state.initialized && state.fingerprint) return;

                const raw = generateDeviceFingerprint();
                const hash = hashFingerprint(raw);

                set({ fingerprint: hash, initialized: true });
            },

            getFingerprint: () => {
                const state = get();

                if (state.fingerprint) {
                    return state.fingerprint;
                }

                if (typeof window === "undefined") {
                    // Na serwerze zwracamy pusty string – nie będzie używany
                    return "";
                }

                // Generujemy tylko na kliencie
                const raw = generateDeviceFingerprint();
                const hash = hashFingerprint(raw);

                set({ fingerprint: hash, initialized: true });
                return hash;
            },
        }),
        {
            name: "fingerprint_v2",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // ← KLUCZOWE
        }
    )
);
