import { client } from "@/utils";

const COMMENT_COOLDOWN_MINUTES = 1;

export async function checkCommentCooldown(params: { recipeId: string; fingerprint: string }): Promise<{ allowed: boolean }> {
    const { recipeId, fingerprint } = params;

    const now = new Date();
    const cutoffTime = new Date(now.getTime() - COMMENT_COOLDOWN_MINUTES * 60000).toISOString();

    const lastCommentQuery = `*[_type=="recipeComment" && recipeId==$recipeId && fingerprint==$fingerprint] | order(createdAt desc)[0]`;

    const lastComment = await client.fetch(lastCommentQuery, {
        recipeId,
        fingerprint,
    });

    if (lastComment && lastComment.createdAt > cutoffTime) {
        return { allowed: false };
    }

    return { allowed: true };
}
