// utils/checkIsOwnComment.ts

export function checkIsOwnComment(fingerprint?: string | null, commentFingerprint?: string | null) {
    return Boolean(fingerprint && commentFingerprint && fingerprint === commentFingerprint);
}
