import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_AUTOCOMPLETE_URL = "https://unsplash.com/nautocomplete";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query")?.trim();

        if (!query) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "MISSING_QUERY",
                        message: "Brak parametru query",
                    },
                },
                { status: 400 }
            );
        }

        const response = await fetch(`${UNSPLASH_AUTOCOMPLETE_URL}/${encodeURIComponent(query)}`, {
            headers: {
                Accept: "application/json",
            },

            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: "UNSPLASH_AUTOCOMPLETE_ERROR",
                        message: `Unsplash zwrócił status ${response.status}`,
                    },
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(
            {
                ok: true,
                data,
            },
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } catch (err) {
        console.error("[UNSPLASH][AUTOCOMPLETE]", err);

        return NextResponse.json(
            {
                ok: false,
                error: {
                    code: "UNSPLASH_AUTOCOMPLETE_FETCH_ERROR",
                    message: "Nie udało się pobrać podpowiedzi z Unsplash",
                },
            },
            { status: 500 }
        );
    }
}
