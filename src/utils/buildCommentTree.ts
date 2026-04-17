import { RecipeComment } from "@/types";

export type CommentNode = RecipeComment & {
    replies: CommentNode[];
};

export function buildCommentTree(comments: RecipeComment[]): CommentNode[] {
    if (!Array.isArray(comments)) return [];

    const commentMap = new Map<string, CommentNode>();
    const rootComments: CommentNode[] = [];

    // 🔥 1. tworzymy bezpieczne węzły
    for (const comment of comments) {
        if (!comment?._id) continue;

        commentMap.set(comment._id, {
            ...comment,
            replies: [],
        });
    }

    // 🔥 2. budujemy drzewo
    for (const comment of comments) {
        if (!comment?._id) continue;

        const currentNode = commentMap.get(comment._id);

        // 🧨 safety: jeśli node nie istnieje → pomijamy
        if (!currentNode) continue;

        if (comment.parentId) {
            const parentNode = commentMap.get(comment.parentId);

            // 🔥 jeśli parent istnieje → podpinamy
            if (parentNode) {
                parentNode.replies.push(currentNode);
            } else {
                // 🔥 orphan → traktujemy jako root (NIE gubimy danych)
                rootComments.push(currentNode);
            }
        } else {
            rootComments.push(currentNode);
        }
    }

    // 🔥 3. final safety pass (usuwa ewentualne dziury)
    return rootComments.filter(Boolean);
}
