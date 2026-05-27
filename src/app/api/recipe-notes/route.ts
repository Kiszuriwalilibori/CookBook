import { NextResponse } from "next/server";

import { getUserFromCookies } from "@/utils/server/getUserFromCookies";
import { writeClient } from "@/utils";
function getRecipeNotesId(userEmail: string, recipeId: string) {
    const safeUser = userEmail.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `recipeNotes_${safeUser}_${recipeId}`;
}

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

    const docId = getRecipeNotesId(user.email, recipeId);

    const note = await writeClient.fetch(`*[_id == $id][0]{ notes }`, { id: docId });

    return NextResponse.json({ notes: note?.notes || "" });
}

//
// POST — create / update (upsert)
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

    const sanitizedNotes = notes?.trim().slice(0, 2000);

    if (!sanitizedNotes) {
        return NextResponse.json({ error: "Notes cannot be empty" }, { status: 400 });
    }

    const docId = getRecipeNotesId(user.email, recipeId);

    await writeClient
        .transaction()
        .createIfNotExists({
            _id: docId,
            _type: "recipeNotes",
            userEmail: user.email,
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
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const docId = getRecipeNotesId(user.email, recipeId);

    await writeClient.delete(docId);

    return NextResponse.json({ success: true });
}
