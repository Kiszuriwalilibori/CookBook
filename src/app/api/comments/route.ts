import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { analyzeComment, writeClient, checkCommentCooldown } from "@/utils";

import { nanoid } from "nanoid";
import { handleShortComment } from "./handleShortComment";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId)
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "MISSING_RECIPE_ID",
                        message: "Nie znaleziono przepisu, który chcesz skomentować",
                    },
                },
                { status: 400 }
            );

        const comments = await writeClient.fetch(`*[_type=="recipeComment" && recipeId==$recipeId] | order(createdAt desc)`, { recipeId });

        return NextResponse.json(
            {
                ok: true,
                data: { comments },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("[COMMENTS][GET]", err);
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "FETCH_COMMENTS_FAILED",
                    message: "Nie udało się pobrać komentarzy",
                },
            },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { recipeId, content, author, fingerprint, parentId, website } = body;

        // 🟢 HONEYPOT
        if (website) {
            console.log("[SPAM] honeypot triggered");
            return NextResponse.json({ ok: false }, { status: 400 });
        }

        if (!recipeId || !content?.trim() || !author || !fingerprint) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { allowed } = await checkCommentCooldown({ recipeId, fingerprint, parentId: parentId ?? null });

        if (!allowed) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "COMMENT_COOLDOWN",
                        message: "Niedawno komentowałeś, odczekaj chwilę",
                    },
                },
                { status: 429 }
            );
        }
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        const isAdmin =
            !!token &&
            (await new google.auth.OAuth2()
                .verifyIdToken({
                    idToken: token,
                    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                })
                .then(t => t.getPayload()?.email?.toLowerCase() === process.env.MY_EMAIL)
                .catch(() => false));
        const id = `comment-${nanoid()}`;

        // 🔥 MODERATION
        const result = await analyzeComment(content);
        const isApproved = result.valid;

        if (!isApproved) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "COMMENT_REJECTED",
                        message: "Komentarz nie przeszedł moderacji",
                    },
                },
                { status: 400 }
            );
        }

        const comment = {
            _type: "recipeComment",
            _id: id,

            recipeId,
            parentId: parentId || null,

            content: content.trim(),
            author,
            isAuthor: isAdmin,

            createdAt: new Date().toISOString(),
            fingerprint,
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
export async function PATCH(req: Request) {
    try {
        // const { commentId, fingerprint, option } = await req.json();
        const body = await req.json();
        const { commentId, fingerprint, option } = body;
        if (!option) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "MISSING_OPTION",
                        message: "Brak parametru 'option'",
                    },
                },
                { status: 400 }
            );
        }

        switch (option) {
            case "HANDLE_LIKE":
                // ====================  LOGIKA LAJKOWANIA====================
                console.log("handle lki");
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

            // ================================================================

            case "HANDLE_SHORT_COMMENT":
                return await handleShortComment(body);

            default:
                return NextResponse.json(
                    {
                        ok: false,
                        error: {
                            code: "UNKNOWN_OPTION",
                            message: `Nieznana opcja: ${option}`,
                        },
                    },
                    { status: 400 }
                );
        }
    } catch (err) {
        console.error("[COMMENTS][PATCH]", err);
        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "INTERNAL_ERROR",
                    message: "Failed to process request",
                },
            },
            { status: 500 }
        );
    }
}
