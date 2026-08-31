import { NextResponse, NextRequest } from "next/server";
import { writeClient } from "@/utils";
import { handleShortComment, HandleShortCommentArgs } from "./handleShortComment.service";
import { handleLike, HandleLikeArgs } from "./like.service";
import { createComment, CreateCommentInput } from "./comment.service";
import { ApiError, apiErrorResponse, parseBody } from "@/models/apiResponse";

type CommentPatchBody = (HandleLikeArgs & { option: "HANDLE_LIKE" }) | (HandleShortCommentArgs & { option: "HANDLE_SHORT_COMMENT" });

export async function GET(req: NextRequest) {
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
        return apiErrorResponse(err);
    }
}
export async function POST(req: NextRequest) {
    try {
        const body = await parseBody<CreateCommentInput>(req);
        const result = await createComment(body);

        return NextResponse.json({ ok: true, data: result }, { status: 200 });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await parseBody<CommentPatchBody>(req);
        const { option } = body;
        if (!option) {
            throw new ApiError("MISSING_OPTION", "Brak parametru 'option'", 400);
        }

        switch (option) {
            case "HANDLE_LIKE":
                const likeResult = await handleLike(body);
                return NextResponse.json({ ok: true, data: likeResult }, { status: 200 });

            case "HANDLE_SHORT_COMMENT":
                const handleShortCommentResult = await handleShortComment(body);
                return NextResponse.json({ ok: true, data: handleShortCommentResult }, { status: 200 });
            default:
                throw new ApiError("UNKNOWN_OPTION", `Nieznana opcja: ${option}`, 400);
        }
    } catch (err: unknown) {
        console.error("[COMMENTS][PATCH]", err);
        return apiErrorResponse(err);
    }
}
