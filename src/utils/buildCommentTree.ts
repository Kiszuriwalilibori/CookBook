import { RecipeComment } from "@/types";

export type CommentNode = RecipeComment & {
    replies: CommentNode[];
};

export function buildCommentTree(comments: RecipeComment[]): CommentNode[] {
    const commentMap = new Map<string, CommentNode>();
    const rootComments: CommentNode[] = [];

    for (const comment of comments) {
        commentMap.set(comment._id, {
            ...comment,
            replies: [],
        });
    }

    for (const comment of comments) {
        const currentNode = commentMap.get(comment._id)!;

        if (comment.parentId) {
            const parentNode = commentMap.get(comment.parentId);
            parentNode?.replies.push(currentNode);
        } else {
            rootComments.push(currentNode);
        }
    }

    return rootComments;
}
