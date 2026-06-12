// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//     const headers = new Headers(request.headers);
//     headers.set("x-current-path", request.nextUrl.pathname);

//     return NextResponse.next({ headers });
// }

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);

    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    const response = NextResponse.next({ headers });
    console.log("response", response);
    const existingUserId = request.cookies.get("userId")?.value;

    if (!existingUserId) {
        response.cookies.set("userId", crypto.randomUUID(), {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        });
    }

    return response;
}
