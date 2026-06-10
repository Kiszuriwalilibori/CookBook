import { NextResponse } from "next/server";
import { writeClient } from "@/utils";
import { handleShortComment } from "./handleShortComment";
import { handleLike } from "./like.service";
import { ApiError, createComment } from "./comment.service";

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
        const result = await createComment(body);

        return NextResponse.json({ ok: true, data: result }, { status: 200 });
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: err.code,
                        message: err.message,
                    },
                },
                { status: err.status ?? 500 }
            );
        } else {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Wystąpił nieoczekiwany błąd serwera",
                    },
                },
                { status: 500 }
            );
        }
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { option } = body;
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
                const result = await handleLike(body);
                return NextResponse.json({ ok: true, data: result }, { status: 200 });

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
    } catch (err: unknown) {
        console.error("[COMMENTS][PATCH]", err);
        if (err instanceof ApiError) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: err.code,
                        message: err.message,
                    },
                },
                { status: err.status ?? 500 }
            );
        } else {
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
}
