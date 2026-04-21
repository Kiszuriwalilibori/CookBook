import { useFingerprintStore } from "@/stores";

export function useFingerprint(): string {
    const getFingerprint = useFingerprintStore(state => state.getFingerprint);

    return getFingerprint();
}
