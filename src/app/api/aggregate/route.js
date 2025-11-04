// const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || "mextu0pu";
// const SANITY_DATASET = process.env.SANITY_DATASET || "production";
// const SANITY_TOKEN = process.env.SANITY_TOKEN || ""; // optional, required for private datasets

// function normalizeLower(s) {
//     if (typeof s !== "string") return null;
//     const t = s.trim();
//     if (t === "") return null;
//     return t.toLowerCase();
// }

// function capitalizeFirst(s) {
//     if (typeof s !== "string") return null;
//     const t = s.trim();
//     if (t.length === 0) return null;
//     return t.charAt(0).toUpperCase() + t.slice(1);
// }

// export async function POST(req) {
//     try {
//         // GROQ: request just the fields we need
//         const groq = `*[_type == "recipe"]{Products, dietaryRestrictions, cuisine, tags, title}`;
//         const query = encodeURIComponent(groq);
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

//         const fetchOpts = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         };
//         if (SANITY_TOKEN) {
//             fetchOpts.headers.Authorization = `Bearer ${SANITY_TOKEN}`;
//         }

//         const resp = await fetch(url, fetchOpts);
//         if (!resp.ok) {
//             throw new Error(`Sanity fetch failed: ${resp.status} ${resp.statusText}`);
//         }
//         const payload = await resp.json();
//         const recipes = Array.isArray(payload.result) ? payload.result : [];

//         // Use sets for uniqueness
//         const productsSet = new Set();
//         const dietarySet = new Set();
//         const cuisineSet = new Set();
//         const tagsSet = new Set();
//         const titlesSet = new Set();

//         for (const r of recipes) {
//             // Products (array of strings, per schema 'Products')
//             if (Array.isArray(r.Products)) {
//                 for (const p of r.Products) {
//                     const v = normalizeLower(p);
//                     if (v) productsSet.add(v);
//                 }
//             }

//             // dietaryRestrictions (array of strings)
//             if (Array.isArray(r.dietaryRestrictions)) {
//                 for (const d of r.dietaryRestrictions) {
//                     const v = normalizeLower(d);
//                     if (v) dietarySet.add(v);
//                 }
//             }

//             // cuisine - schema has 'cuisine' as a string; but handle array/string
//             if (Array.isArray(r.cuisine)) {
//                 for (const c of r.cuisine) {
//                     const v = normalizeLower(c);
//                     if (v) cuisineSet.add(v);
//                 }
//             } else if (typeof r.cuisine === "string") {
//                 const v = normalizeLower(r.cuisine);
//                 if (v) cuisineSet.add(v);
//             }

//             // tags (array of strings)
//             if (Array.isArray(r.tags)) {
//                 for (const t of r.tags) {
//                     const v = normalizeLower(t);
//                     if (v) tagsSet.add(v);
//                 }
//             }

//             // title - capitalize first letter (keep rest as-is)
//             if (typeof r.title === "string" && r.title.trim() !== "") {
//                 const t = capitalizeFirst(r.title);
//                 if (t) titlesSet.add(t);
//             }
//         }

//         // Convert sets to sorted arrays
//         const uniqueProducts = Array.from(productsSet).sort((a, b) => a.localeCompare(b));
//         const uniqueDietary = Array.from(dietarySet).sort((a, b) => a.localeCompare(b));
//         const uniqueCuisines = Array.from(cuisineSet).sort((a, b) => a.localeCompare(b));
//         const uniqueTags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
//         const uniqueTitles = Array.from(titlesSet).sort((a, b) => a.localeCompare(b));

//         // Optional debug log
//         console.log("Aggregated counts:", {
//             recipes: recipes.length,
//             products: uniqueProducts,
//             dietary: uniqueDietary,
//             cuisines: uniqueCuisines,
//             tags: uniqueTags,
//             titles: uniqueTitles,
//         });

//         return new Response(
//             JSON.stringify({
//                 products: uniqueProducts,
//                 dietaryRestrictions: uniqueDietary,
//                 cuisines: uniqueCuisines,
//                 tags: uniqueTags,
//                 titles: uniqueTitles,
//             }),
//             { status: 200, headers: { "Content-Type": "application/json" } }
//         );
//     } catch (err) {
//         console.error("Aggregation error:", err);
//         return new Response(JSON.stringify({ error: "Aggregation failed", details: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
//     }
// }
// Aggregates recipe fields from Sanity and upserts a single recipesSummary document.
//
// Required environment variables (set these in Vercel):
// - SANITY_PROJECT_ID
// - SANITY_DATASET
// - SANITY_TOKEN (required to write; needed for private datasets)
//
// The route performs:
// 1. GROQ query to fetch Products, dietaryRestrictions, cuisine, tags, title from all recipes
// 2. Normalize values (lowercase for most, titles capitalized first letter)
// 3. Deduplicate and sort
// 4. Upsert a document with _id "recipesSummary" in Sanity via the data/mutate endpoint

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET = process.env.SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN || "";

function normalizeLower(s) {
    if (typeof s !== "string") return null;
    const t = s.trim();
    if (t === "") return null;
    return t.toLowerCase();
}

function capitalizeFirst(s) {
    if (typeof s !== "string") return null;
    const t = s.trim();
    if (t.length === 0) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
}

export async function POST(req) {
    try {
        // Build GROQ to fetch relevant fields
        const groq = `*[_type == "recipe"]{Products, dietaryRestrictions, cuisine, tags, title}`;
        const query = encodeURIComponent(groq);
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

        const fetchOpts = { method: "GET", headers: { "Content-Type": "application/json" } };
        if (SANITY_TOKEN) fetchOpts.headers.Authorization = `Bearer ${SANITY_TOKEN}`;

        const resp = await fetch(url, fetchOpts);
        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText} ${text}`);
        }
        const payload = await resp.json();
        const recipes = Array.isArray(payload.result) ? payload.result : [];

        // Deduplicate using sets
        const productsSet = new Set();
        const dietarySet = new Set();
        const cuisineSet = new Set();
        const tagsSet = new Set();
        const titlesSet = new Set();

        for (const r of recipes) {
            // Products
            if (Array.isArray(r.Products)) {
                for (const p of r.Products) {
                    const v = normalizeLower(p);
                    if (v) productsSet.add(v);
                }
            }

            // dietaryRestrictions
            if (Array.isArray(r.dietaryRestrictions)) {
                for (const d of r.dietaryRestrictions) {
                    const v = normalizeLower(d);
                    if (v) dietarySet.add(v);
                }
            }

            // cuisine (can be string or array)
            if (Array.isArray(r.cuisine)) {
                for (const c of r.cuisine) {
                    const v = normalizeLower(c);
                    if (v) cuisineSet.add(v);
                }
            } else if (typeof r.cuisine === "string") {
                const v = normalizeLower(r.cuisine);
                if (v) cuisineSet.add(v);
            }

            // tags
            if (Array.isArray(r.tags)) {
                for (const t of r.tags) {
                    const v = normalizeLower(t);
                    if (v) tagsSet.add(v);
                }
            }

            // title - capitalize first letter
            if (typeof r.title === "string" && r.title.trim() !== "") {
                const t = capitalizeFirst(r.title);
                if (t) titlesSet.add(t);
            }
        }

        const uniqueProducts = Array.from(productsSet).sort((a, b) => a.localeCompare(b));
        const uniqueDietary = Array.from(dietarySet).sort((a, b) => a.localeCompare(b));
        const uniqueCuisines = Array.from(cuisineSet).sort((a, b) => a.localeCompare(b));
        const uniqueTags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
        const uniqueTitles = Array.from(titlesSet).sort((a, b) => a.localeCompare(b));

        const totalCount = recipes.length;

        // Build the summary document that matches studio/schemas/recipesSummary.js
        const summaryDoc = {
            _id: "recipesSummary", // fixed id for idempotent upserts
            _type: "recipesSummary",
            totalCount,
            products: uniqueProducts,
            dietaryRestrictions: uniqueDietary,
            cuisines: uniqueCuisines,
            tags: uniqueTags,
            titles: uniqueTitles,
            categories: uniqueCuisines, // keep categories as alias for cuisines for backward compat
        };

        // Upsert the document into Sanity via data/mutate
        if (!SANITY_TOKEN) {
            // If no token is available, return the aggregated result but do not attempt write
            console.warn("SANITY_TOKEN not provided; skipping upsert. Returning aggregation only.");
            return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
        const mutationBody = {
            mutations: [
                {
                    createOrReplace: summaryDoc,
                },
            ],
        };

        const mutateResp = await fetch(mutateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SANITY_TOKEN}`,
            },
            body: JSON.stringify(mutationBody),
        });

        const mutateResultText = await mutateResp.text();
        let mutateResult;
        try {
            mutateResult = JSON.parse(mutateResultText);
        } catch {
            mutateResult = { raw: mutateResultText };
        }

        if (!mutateResp.ok) {
            console.error("Sanity upsert failed:", mutateResp.status, mutateResp.statusText, mutateResult);
            throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
        }

        console.log("Aggregated counts:", {
            recipes: totalCount,
            products: uniqueProducts.length,
            dietary: uniqueDietary.length,
            cuisines: uniqueCuisines.length,
            tags: uniqueTags.length,
            titles: uniqueTitles.length,
        });

        return new Response(JSON.stringify({ summary: summaryDoc, sanityResult: mutateResult }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error("Aggregation/upsert error:", err);
        return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
