import { NextResponse } from "next/server";
import { writeClient } from "@/utils";
import { nanoid } from "nanoid";
import { analyzeComment } from "@/utils/perspective";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        const comments = await writeClient.fetch(`*[_type=="recipeComment" && recipeId==$recipeId && status=="approved"] | order(createdAt asc)`, { recipeId });

        return NextResponse.json({ comments });
    } catch (err) {
        console.error("[COMMENTS][GET]", err);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { recipeId, content, author, fingerprint, parentId } = await req.json();

        if (!recipeId || !content?.trim() || !author || !fingerprint) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const id = `comment-${nanoid()}`;

        // 🔥 MODERATION
        const result = await analyzeComment(content);
        const isApproved = result.valid;

        // ❌ jeśli rejected → NIE zapisujemy w DB
        if (!isApproved) {
            return NextResponse.json({ ok: false, reason: "rejected" }, { status: 400 });
        }

        // ✔ zapis tylko approved
        const comment = {
            _type: "recipeComment",
            _id: id,

            recipeId,
            parentId: parentId || null,

            content: content.trim(),
            author,

            createdAt: new Date().toISOString(),
            fingerprint,

            likesCount: 0,
            likes: [],

            status: "approved",
            moderationScore: result.score,
        };

        await writeClient.create(comment);

        return NextResponse.json({
            ok: true,
            comment,
        });
    } catch (err) {
        console.error("[COMMENTS][POST]", err);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
