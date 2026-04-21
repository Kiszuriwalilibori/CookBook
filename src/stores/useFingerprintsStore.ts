// Gdybyś chciał jeszcze bardziej „clean”

// Można by zrobić wersję:

// init w middleware
// albo „lazy persist hydration safe guard”

// ale to już większa przebudowa — tu nie jest potrzebna.

// Jeśli chcesz, mogę pokazać jeszcze wersję:
// 👉
// która działa SSR-safe (Next.js / hydration-safe fingerprint)
// 👉 albo
// taką, która nie zmienia fingerprinta między tabami i incognito edge-case’ami

// edna ważna uwaga (uczciwie)

// Ten model:

// zakłada, że fingerprint może być generowany synchronicznie na renderze

// Jeśli kiedyś będziesz chciał:

// WebCrypto async
// API fingerprint server-side
// lub SSR (Next.js)

// to wtedy trzeba będzie zrobić wersję async-safe.

// Jeśli chcesz, mogę Ci pokazać:
// 👉
// wersję „enterprise-grade” (SSR-safe + hydration-safe + stable ID między tabami)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { generateDeviceFingerprint, hashFingerprint } from "@/utils/fingerprint";

interface FingerprintState {
    fingerprint: string | null;
    initialized: boolean;

    init: () => string;

    getFingerprint: () => string;
}

export const useFingerprintStore = create<FingerprintState>()(
    persist(
        (set, get) => ({
            fingerprint: null,
            initialized: false,

            /**
             * Jednorazowa inicjalizacja (jeśli ktoś chce wywołać ręcznie)
             */
            init: () => {
                const state = get();

                if (state.initialized && state.fingerprint) {
                    return state.fingerprint;
                }

                const raw = generateDeviceFingerprint();
                const hash = hashFingerprint(raw);

                set({
                    fingerprint: hash,
                    initialized: true,
                });

                return hash;
            },

            /**
             * Główna metoda - zawsze zwraca fingerprint
             * i gwarantuje jego istnienie
             */
            getFingerprint: () => {
                const state = get();

                if (state.fingerprint) {
                    return state.fingerprint;
                }

                const raw = generateDeviceFingerprint();
                const hash = hashFingerprint(raw);

                set({
                    fingerprint: hash,
                    initialized: true,
                });

                return hash;
            },
        }),
        {
            name: "fingerprint_v1",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
