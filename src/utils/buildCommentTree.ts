import type { RecipeComment } from "@/types";

export type CommentNode = RecipeComment & {
    replies: CommentNode[];
};

export function buildCommentTree(comments: RecipeComment[]): CommentNode[] {
    if (!Array.isArray(comments)) return [];

    const commentMap = new Map<string, CommentNode>();
    const rootComments: CommentNode[] = [];

    for (const comment of comments) {
        if (!comment?._id) continue;

        commentMap.set(comment._id, {
            ...comment,
            replies: [],
        });
    }

    for (const comment of comments) {
        if (!comment?._id) continue;

        const currentNode = commentMap.get(comment._id);
        if (!currentNode) continue;

        if (comment.parentId) {
            const parentNode = commentMap.get(comment.parentId);

            if (parentNode) {
                parentNode.replies.push(currentNode);
            } else {
                rootComments.push(currentNode);
            }
        } else {
            rootComments.push(currentNode);
        }
    }

    return rootComments.filter(Boolean);
}
