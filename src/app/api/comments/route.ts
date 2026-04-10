import { NextResponse } from "next/server";
import { writeClient } from "@/utils";
import { nanoid } from "nanoid";
import { RecipeCommentLike } from "@/types";

//
// 📥 GET - wszystkie komentarze dla przepisu (FLAT)
//
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        const comments = await writeClient.fetch(`*[_type=="recipeComment" && recipeId==$recipeId] | order(createdAt asc)`, { recipeId });

        return NextResponse.json({ comments });
    } catch (err) {
        console.error("[comments][GET]", err);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

//
// ✍️ POST - dodanie komentarza lub reply (FLAT)
//
export async function POST(req: Request) {
    try {
        const { recipeId, content, author, fingerprint, parentId } = await req.json();

        if (!recipeId || !content?.trim() || !author || !fingerprint) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const comment = {
            _type: "recipeComment",
            _id: `comment-${nanoid()}`,

            recipeId,
            parentId: parentId || null,

            content: content.trim(),
            author,

            createdAt: new Date().toISOString(),
            fingerprint,

            likesCount: 0,
            likes: [],
        };

        await writeClient.create(comment);

        return NextResponse.json({ ok: true, comment });
    } catch (err) {
        console.error("[comments][POST]", err);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}

//
// ❤️ PATCH - like / unlike (flat, bez rekurencji)
//
export async function PATCH(req: Request) {
    try {
        const { commentId, author, fingerprint } = await req.json();

        if (!commentId || !fingerprint) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const comment = await writeClient.getDocument(commentId);

        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
        const likes = (comment.likes || []) as RecipeCommentLike[];

        const alreadyLiked = likes.some(l => l.fingerprint === fingerprint);

        let patch = writeClient.patch(commentId);

        if (alreadyLiked) {
            patch = patch.dec({ likesCount: 1 }).set({
                likes: likes.filter((l: RecipeCommentLike) => l.fingerprint !== fingerprint),
            });
        } else {
            patch = patch.inc({ likesCount: 1 }).append("likes", [{ author, fingerprint }]);
        }

        await patch.commit();

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[comments][PATCH]", err);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
