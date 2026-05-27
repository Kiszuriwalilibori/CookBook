// "use server";
// import { client } from "@/utils";

// const COMMENT_COOLDOWN_MINUTES = 1;
// const COOLDOWN_MS = COMMENT_COOLDOWN_MINUTES * 60 * 1000;

// export async function checkCommentCooldown(fingerprint: string): Promise<{ allowed: boolean; remainingSeconds?: number }> {
//     const now = new Date();
//     const cutoffTime = new Date(now.getTime() - COOLDOWN_MS).toISOString();

//     const lastCommentQuery = `
//     *[
//         _type == "recipeComment" &&
//         fingerprint == $fingerprint
//     ] | order(createdAt desc)[0]
//     `;

//     const lastComment = await client.fetch(lastCommentQuery, { fingerprint });

//     if (lastComment && new Date(lastComment.createdAt) > new Date(cutoffTime)) {
//         return { allowed: false };
//     }

//     return { allowed: true };
// }
// src/app/(main)/recipes/[slug]/parts/Comments/utils/checkCommentCooldown.ts

"use server";
import { client } from "@/utils";
const COMMENT_COOLDOWN_MINUTES = 1;
const COOLDOWN_MS = COMMENT_COOLDOWN_MINUTES * 60 * 1000;

export async function checkCommentCooldown(fingerprint: string): Promise<{
    allowed: boolean;
    remainingSeconds?: number;
}> {
    const now = new Date();

    const lastCommentQuery = `
    *[
        _type == "recipeComment" &&
        fingerprint == $fingerprint
    ] | order(createdAt desc)[0]
    `;

    const lastComment = await client.fetch(lastCommentQuery, { fingerprint });

    if (lastComment) {
        const lastCommentDate = new Date(lastComment.createdAt);
        const timeSinceLastComment = now.getTime() - lastCommentDate.getTime();

        if (timeSinceLastComment < COOLDOWN_MS) {
            const remainingMs = COOLDOWN_MS - timeSinceLastComment;
            const remainingSeconds = Math.ceil(remainingMs / 1000);

            return {
                allowed: false,
                remainingSeconds,
            };
        }
    }

    return { allowed: true };
}
