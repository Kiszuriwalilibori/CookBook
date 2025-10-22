import { client } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await client.fetch('*[_type == "test"]');
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
    }
}
