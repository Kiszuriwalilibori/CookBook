// Serverless Vercel handler version of aggregation

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Only POST requests allowed" });
        return;
    }

    try {
        // Assume the client sends a JSON array in the request body
        const data = req.body;
        if (!Array.isArray(data)) {
            res.status(400).json({ error: "Request body must be a JSON array" });
            return;
        }

        // Aggregation logic (example: sum "count" fields)
        const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

        res.status(200).json({ total });
    } catch (err) {
        res.status(500).json({ error: "Aggregation failed", details: err.message });
    }
}
