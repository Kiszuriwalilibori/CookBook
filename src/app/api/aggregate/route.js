// export async function POST(req) {
//     try {
//         const data = await req.json();
//         if (!Array.isArray(data)) {
//             return new Response(JSON.stringify({ error: "Request body must be a JSON array" }), { status: 400, headers: { "Content-Type": "application/json" } });
//         }
//         const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
//         return new Response(JSON.stringify({ total }), { status: 200, headers: { "Content-Type": "application/json" } });
//     } catch (err) {
//         return new Response(JSON.stringify({ error: "Aggregation failed", details: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
//     }
// }

// //
// curl -X POST https://cook-book-inky.vercel.app/api/aggregate -H "Content-Type: application/json" -d "[{\"count\":4},{\"count\":6}]"

export async function POST(req) {
    try {
        const data = await req.json();
        console.log("Sanity webhook payload:", data);

        // Case 1: If data is an array, aggregate "count" fields (manual/test requests)
        if (Array.isArray(data)) {
            const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
            return new Response(JSON.stringify({ received: "array", total }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // Case 2: If Sanity sends a webhook (data is an object - likely your document)
        if (typeof data === "object" && data !== null) {
            // For demo: echo back received object shape and id/title if available
            return new Response(
                JSON.stringify({
                    received: "sanity_document",
                    id: data._id,
                    type: data._type,
                    title: data.title,
                    keys: Object.keys(data),
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Unknown payload shape
        return new Response(JSON.stringify({ error: "Unsupported payload format" }), { status: 400, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        return new Response(
            JSON.stringify({
                error: "Aggregation failed",
                details: err.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
