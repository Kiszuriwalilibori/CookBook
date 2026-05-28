"use server";
import { COMMENT_COOLDOWN_MINUTES } from "@/setup";
import { client } from "@/utils";

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
