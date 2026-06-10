import { writeClient } from "@/utils";
import { getUserFromCookies } from "@/utils/server/getUserFromCookies";
import { ApiError } from "./comment.service";

type HandleShortCommentArgs = {
    commentId: string;
    shortContent: string;
};

function validateArgs(args: HandleShortCommentArgs) {
    const { commentId, shortContent } = args;

    if (!commentId || typeof shortContent !== "string") {
        throw new ApiError("INVALID_INPUT", "Brak commentId lub shortContent", 400);
    }

    const trimmed = shortContent.trim();

    if (trimmed.length === 0) {
        throw new ApiError("EMPTY_SHORT_COMMENT", "Skrócony komentarz nie może być pusty", 400);
    }

    if (trimmed.length > 300) {
        throw new ApiError("SHORT_COMMENT_TOO_LONG", "Skrócony komentarz jest za długi (max 300 znaków)", 400);
    }
}

async function assertIsAdmin() {
    const user = await getUserFromCookies();
    if (!user?.isAdmin) {
        throw new ApiError("FORBIDDEN", "Tylko administrator może dodawać short comment", 403);
    }
}

async function getComment(commentId: string) {
    const comment = await writeClient.getDocument(commentId);

    if (!comment) {
        throw new ApiError("COMMENT_NOT_FOUND", "Nie znaleziono komentarza", 404);
    }

    return comment;
}

function buildShortComment(shortContent: string) {
    return {
        content: shortContent.trim(),
        createdAt: new Date().toISOString(),
    };
}

async function saveShortComment(commentId: string, shortComment: object) {
    await writeClient.patch(commentId).set({ shortComment }).commit();
}

export async function handleShortComment(args: HandleShortCommentArgs) {
    validateArgs(args);
    await assertIsAdmin();
    await getComment(args.commentId);

    const shortComment = buildShortComment(args.shortContent);

    await saveShortComment(args.commentId, shortComment);

    return {
        commentId: args.commentId,
        shortComment,
    };
}
