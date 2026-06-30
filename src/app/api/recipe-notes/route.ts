import { NextResponse } from "next/server";

import { writeClient } from "@/utils";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
function getRecipeNotesId(userId: string, recipeId: string) {
    return `recipeNotes_${userId}_${recipeId}`;
}

//
// GET — pobranie notatki
//
export async function GET(req: Request) {
    const userId = await getUserIdFromCookies();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const docId = getRecipeNotesId(userId, recipeId);

    const note = await writeClient.fetch(`*[_id == $id][0]{ notes }`, { id: docId });

    return NextResponse.json({ notes: note?.notes || "" });
}

//
// POST — create / update (upsert)
//
export async function POST(req: Request) {
    const userId = await getUserIdFromCookies();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipeId, notes } = await req.json();

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const sanitizedNotes = notes?.trim().slice(0, 2000);

    if (!sanitizedNotes) {
        return NextResponse.json({ error: "Notes cannot be empty" }, { status: 400 });
    }

    const docId = getRecipeNotesId(userId, recipeId);

    await writeClient
        .transaction()
        .createIfNotExists({
            _id: docId,
            _type: "recipeNotes",
            userId,
            recipe: {
                _type: "reference",
                _ref: recipeId,
            },
            notes: "",
        })
        .patch(docId, {
            set: {
                notes: sanitizedNotes,
            },
        })
        .commit();
    return NextResponse.json({ success: true });
}
//
// DELETE — usuń notatkę
//
export async function DELETE(req: Request) {
    const userId = await getUserIdFromCookies();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const docId = getRecipeNotesId(userId, recipeId);

    await writeClient.delete(docId);

    return NextResponse.json({ success: true });
}
