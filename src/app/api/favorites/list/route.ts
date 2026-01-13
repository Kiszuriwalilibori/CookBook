import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { client, verifyGoogle } from "@/utils";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("session")?.value;

        if (!token) {
            console.log("[favorites][GET] No token found, returning 401");
            return NextResponse.json([], { status: 401 });
        }

        // Verify token
        const user = await verifyGoogle(token);

        // Fetch favorites from Sanity
        const favorites = await client.fetch(
            `*[_type=="favorite" && userId==$userId]{
                recipe->{
                    _id,
                    title,
                    slug
                }
            } | order(createdAt desc)`,
            { userId: user.userId }
        );

        return NextResponse.json(favorites);
    } catch (err) {
        console.error("[favorites][GET] Error:", err);
        return NextResponse.json([], { status: 401 });
    }
}
