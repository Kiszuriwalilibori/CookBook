export type ApiSuccessResponse<T> = {
    ok: true;
    data: T;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | { ok: false; error: ApiErrorPayload };

export type ApiErrorPayload = {
    code: string;
    message: string;
};
export class ApiError extends Error implements ApiErrorPayload {
    status: number;
    code: string;

    constructor(code: string, message: string, status = 400) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.code = code;
        this.status = status;
    }
}

import { NextRequest, NextResponse } from "next/server";

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

export async function parseBody<T>(req: NextRequest): Promise<T> {
    try {
        return await req.json();
    } catch {
        throw new ApiError("INVALID_JSON", "Nieprawidłowy format JSON", 400);
    }
}
