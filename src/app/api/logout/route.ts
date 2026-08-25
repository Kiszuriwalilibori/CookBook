import { NextResponse } from "next/server";

import { ApiSuccessResponse } from "@/models/apiResponse";

export async function POST() {
    const response = NextResponse.json<ApiSuccessResponse<null>>({
        ok: true,
        data: null,
    });

    response.cookies.set("session", "", {
        path: "/",
        maxAge: 0,
    });

    return response;
}
