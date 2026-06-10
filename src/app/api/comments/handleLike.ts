import { NextResponse } from "next/server";
import { writeClient } from "@/utils";

type HandleLikeBody = {
    commentId: string;
    fingerprint: string;
};

export async function handleLike(body: HandleLikeBody) {
    const { commentId, fingerprint } = body;

    if (!commentId || !fingerprint) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "INVALID_INPUT",
                    message: "Brak odcisku palca lub id komentarza",
                },
            },
            { status: 400 }
        );
    }

    const comment = await writeClient.getDocument(commentId);

    if (!comment) {
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "COMMENT_NOT_FOUND",
                    message: "Nie znaleziono komentarza, który pragniesz polubić",
                },
            },
            { status: 404 }
        );
    }

    const likes = (comment.likes || []) as string[];

    const alreadyLiked = likes.includes(fingerprint);

    let updatedLikes: string[];

    if (alreadyLiked) {
        updatedLikes = likes.filter(f => f !== fingerprint);

        await writeClient.patch(commentId).set({ likes: updatedLikes }).commit();
    } else {
        updatedLikes = [...likes, fingerprint];

        await writeClient.patch(commentId).setIfMissing({ likes: [] }).append("likes", [fingerprint]).commit();
    }

    return NextResponse.json(
        {
            ok: true,
            data: {
                commentId,
                likes: updatedLikes,
                liked: !alreadyLiked,
            },
        },
        { status: 200 }
    );
}
