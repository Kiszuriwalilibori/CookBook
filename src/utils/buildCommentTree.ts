import { RecipeComment } from "@/types";

export function buildCommentTree(comments: RecipeComment[]) {
    const map = new Map<string, RecipeComment & { replies: RecipeComment[] }>();
    const roots: (RecipeComment & { replies: RecipeComment[] })[] = [];

    for (const c of comments) {
        map.set(c._id, { ...c, replies: [] });
    }

    for (const c of comments) {
        const node = map.get(c._id)!;

        if (c.parentId) {
            const parent = map.get(c.parentId);
            parent?.replies.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;
}
