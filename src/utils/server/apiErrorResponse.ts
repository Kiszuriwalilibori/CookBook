import { ApiError } from "@/app/api/comments/comment.service";
import { NextResponse } from "next/server";

export function apiErrorResponse(err: unknown) {
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
    }

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
