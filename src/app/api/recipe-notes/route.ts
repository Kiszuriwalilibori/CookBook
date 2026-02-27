import { NextResponse } from "next/server";

import { getUserFromCookies } from "@/utils/getUserFromCookies";
import { writeClient } from "@/utils";

//
// GET — pobranie notatki
//
export async function GET(req: Request) {
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const note = await writeClient.fetch(
        `*[_type == "recipeNotes" && userEmail == $userEmail && recipe._ref == $recipeId][0]{
      notes
    }`,
        { userEmail: user.email, recipeId }
    );

    return NextResponse.json({ notes: note?.notes || "" });
}

//
// POST — create / update
//
export async function POST(req: Request) {
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId, notes } = await req.json();

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const existing = await writeClient.fetch(`*[_type == "recipeNotes" && userEmail == $userEmail && recipe._ref == $recipeId][0]{ _id }`, { userEmail: user.email, recipeId });

    if (existing?._id) {
        await writeClient.patch(existing._id).set({ notes }).commit();
    } else {
        await writeClient.create({
            _type: "recipeNotes",
            userEmail: user.email,
            recipe: {
                _type: "reference",
                _ref: recipeId,
            },
            notes,
        });
    }

    return NextResponse.json({ success: true });
}
