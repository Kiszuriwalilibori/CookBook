import { client } from "@/utils";

const COMMENT_COOLDOWN_MINUTES = 1;

export async function checkCommentCooldown(params: { recipeId: string; fingerprint: string; parentId?: string | null }): Promise<{ allowed: boolean }> {
    const { recipeId, fingerprint, parentId } = params;

    const now = new Date();
    const cutoffTime = new Date(now.getTime() - COMMENT_COOLDOWN_MINUTES * 60000).toISOString();

    const lastCommentQuery = `
*[
  _type == "recipeComment" &&
  recipeId == $recipeId &&
  fingerprint == $fingerprint &&
  coalesce(parentId, "root") == coalesce($parentId, "root")
] | order(createdAt desc)[0]
`;

    const lastComment = await client.fetch(lastCommentQuery, {
        recipeId,
        fingerprint,
        parentId: parentId ?? null,
    });

    if (lastComment && new Date(lastComment.createdAt) > new Date(cutoffTime)) {
        return { allowed: false };
    }

    return { allowed: true };
}
