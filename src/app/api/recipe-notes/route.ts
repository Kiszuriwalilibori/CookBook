import { NextResponse } from "next/server";

import { client, writeClient } from "@/utils";
import { getUserIdFromCookies } from "@/utils/server/getUserIdFromCookies";
import { MAX_PRIVATE_NOTE_LENGTH } from "@/setup";
function getRecipeNotesId(userId: string, recipeId: string) {
    return `recipeNotes_${userId}_${recipeId}`;
}

import type { NextRequest } from "next/server";
import { ApiError } from "../comments/comment.service";
import { apiErrorResponse } from "@/utils/server/apiErrorResponse";

async function parseBody(req: NextRequest): Promise<{
    recipeId?: string;
    notes?: string;
}> {
    try {
        return await req.json();
    } catch {
        throw new ApiError("INVALID_JSON", "Nieprawidłowy format JSON", 400);
    }
}

//
// GET — pobranie notatki
//

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromCookies();

        if (!userId) {
            throw new ApiError("MISSING_USER", "Nie można zidentyfikować użytkownika", 401);
        }

        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak ID przepisu", 400);
        }

        const docId = getRecipeNotesId(userId, recipeId);

        const note = await writeClient.fetch(`*[_id == $id][0]{ notes }`, { id: docId });

        return NextResponse.json({
            ok: true,
            data: {
                notes: note?.notes ?? "",
            },
        });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
//
// POST — create / update (upsert)
//
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromCookies();

        if (!userId) {
            throw new ApiError("MISSING_USER", "Nie można zidentyfikować użytkownika", 401);
        }

        const { recipeId, notes } = await parseBody(req);

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak ID przepisu", 400);
        }

        const recipe = await client.fetch(`*[_type == "recipe" && _id == $recipeId][0]{ _id }`, { recipeId });

        if (!recipe) {
            throw new ApiError("RECIPE_NOT_FOUND", "Nie znaleziono przepisu", 404);
        }

        const sanitizedNotes = notes?.trim().slice(0, MAX_PRIVATE_NOTE_LENGTH);

        if (!sanitizedNotes) {
            throw new ApiError("EMPTY_NOTES", "Notatka nie może być pusta", 400);
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

        return NextResponse.json({
            ok: true,
            data: {
                notes: sanitizedNotes,
            },
        });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
//
// DELETE — usuń notatkę
//

export async function DELETE(req: NextRequest) {
    try {
        const userId = await getUserIdFromCookies();

        if (!userId) {
            throw new ApiError("MISSING_USER", "Nie można zidentyfikować użytkownika", 401);
        }

        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            throw new ApiError("MISSING_RECIPE_ID", "Brak ID przepisu", 400);
        }

        const docId = getRecipeNotesId(userId, recipeId);

        const note = await client.fetch<{ _id: string } | null>(
            `*[_id == $id][0]{
                _id
            }`,
            { id: docId }
        );

        if (!note) {
            throw new ApiError("NOTE_NOT_FOUND", "Nie znaleziono notatki", 404);
        }

        await writeClient.delete(docId);

        return NextResponse.json({
            ok: true,
            data: null,
        });
    } catch (err: unknown) {
        return apiErrorResponse(err);
    }
}
