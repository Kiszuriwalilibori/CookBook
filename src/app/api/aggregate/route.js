// Serverless Vercel handler version of aggregation

export async function POST(req) {
    try {
        // Parse JSON body
        const data = await req.json();
        if (!Array.isArray(data)) {
            return new Response(JSON.stringify({ error: "Request body must be a JSON array" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Aggregation logic (example: sum "count" fields)
        const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

        return new Response(JSON.stringify({ total }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Aggregation failed", details: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
