import { getUserFromCookies, writeClient } from "@/utils";
import { NextResponse } from "next/server";
type HandleShortCommentBody = {
    commentId: string;
    shortContent: string;
};
export async function handleShortComment(body: HandleShortCommentBody) {
    const { commentId, shortContent } = body;
    console.log(commentId, shortContent);
    if (!commentId || typeof shortContent !== "string") {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Brak commentId lub shortContent",
                },
            },
            { status: 400 }
        );
    }

    if (shortContent.trim().length === 0) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "EMPTY_SHORT_COMMENT",
                    message: "Skrócony komentarz nie może być pusty",
                },
            },
            { status: 400 }
        );
    }

    if (shortContent.trim().length > 300) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "SHORT_COMMENT_TOO_LONG",
                    message: "Skrócony komentarz jest za długi (max 300 znaków)",
                },
            },
            { status: 400 }
        );
    }

    // Pobieramy użytkownika + sprawdzamy czy admin
    const user = await getUserFromCookies();
    if (!user?.isAdmin) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "FORBIDDEN",
                    message: "Tylko administrator może dodawać short comment",
                },
            },
            { status: 403 }
        );
    }

    // Pobieramy komentarz
    const comment = await writeClient.getDocument(commentId);

    if (!comment) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "COMMENT_NOT_FOUND",
                    message: "Nie znaleziono komentarza",
                },
            },
            { status: 404 }
        );
    }

    const shortComment = {
        content: shortContent.trim(),
        createdAt: new Date().toISOString(),
    };

    // Zapisujemy
    await writeClient.patch(commentId).set({ shortComment }).commit();

    return NextResponse.json(
        {
            ok: true,
            data: {
                commentId,
                shortComment,
            },
        },
        { status: 200 }
    );
}
