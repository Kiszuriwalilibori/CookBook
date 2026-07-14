// type ApiSuccess<TData> = {
//     ok: true;
//     data: TData;
// };

// type ApiError = {
//     ok: false;
//     error: {
//         code: string;
//         message: string;
//     };
// };

// export type ApiResponse<TData> = ApiSuccess<TData> | ApiError;
// export default ApiResponse;

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
