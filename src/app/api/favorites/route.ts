import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { client } from "@/utils/client";
import { verifyGoogle } from "../../../lib/googleAuth";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyGoogle(req);
        const { recipeId } = await req.json();

        if (!recipeId) {
            return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
        }

        const existing = await client.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId][0]`, { userId: user.userId, recipeId });

        if (!existing) {
            await client.create({
                _type: "favorite",
                userId: user.userId,
                recipe: { _type: "reference", _ref: recipeId },
                createdAt: new Date().toISOString(),
            });
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await verifyGoogle(req);
        const { recipeId } = await req.json();

        const ids = await client.fetch(`*[_type=="favorite" && userId==$userId && recipe._ref==$recipeId]._id`, { userId: user.userId, recipeId });

        await Promise.all(ids.map((id: string) => client.delete(id)));

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
