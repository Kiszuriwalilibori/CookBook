import { createClient } from "next-sanity";
import { groq } from "next-sanity";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    useCdn: true,
    apiVersion: "2023-10-01",
});

export async function GET(request: NextRequest): Promise<NextResponse> {
    const query = groq`*[_type == "recipesSummary"][0] {
        titles,
        cuisines,
        tags,
        dietaryRestrictions,
        products
    }`;

    try {
        const data = await client.fetch(query);

        if (!data) {
            return NextResponse.json({ error: "Recipes summary not found" }, { status: 404 });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Query error:", error);
        return NextResponse.json({ error: "Query failed", details: (error as Error).message }, { status: 500 });
    }
}
