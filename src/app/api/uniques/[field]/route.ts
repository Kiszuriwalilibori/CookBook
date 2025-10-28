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

// Type for supported fields
type SupportedField = "title" | "cuisine" | "tags" | "dietaryRestrictions" | "ingredients" | "products";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ field: string }> } // Note: params as Promise
): Promise<NextResponse> {
    const awaitedParams = await params; // Await here to fix the error
    const field = awaitedParams.field as SupportedField;
    if (!field) {
        return NextResponse.json({ error: "Field required" }, { status: 400 });
    }

    let query: string;
    switch (field) {
        case "title":
            query = groq`array::unique(*[_type == "recipe"].title) | order(title asc)`;
            break;
        case "cuisine":
            query = groq`array::unique(*[_type == "recipe"].cuisine) | order(cuisine asc)`;
            break;
        case "tags":
            query = groq`array::unique(*[_type == "recipe"].tags[]) | order(string asc)`;
            break;
        case "dietaryRestrictions":
            query = groq`array::unique(*[_type == "recipe"].dietaryRestrictions[]) | order(string asc)`;
            break;
        case "ingredients":
            query = groq`array::unique(*[_type == "recipe"].ingredients[].name) | order(string asc)`;
            break;
        case "products":
            query = groq`array::unique(*[_type == "recipe"].Products[]) | order(string asc)`;
            break;
        default:
            return NextResponse.json({ error: `Unsupported field: ${field}` }, { status: 400 });
    }

    try {
        const options: string[] = await client.fetch<string[]>(query);
        return NextResponse.json(options.filter((opt): opt is string => Boolean(opt)).sort(), { status: 200 });
    } catch (error) {
        console.error("Query error:", error);
        return NextResponse.json({ error: "Query failed", details: (error as Error).message }, { status: 500 });
    }
}
