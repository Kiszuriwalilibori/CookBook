// // Aggregates recipe fields and upserts recipesSummary only when content changed.
// // Improvements:
// // - Verifies optional webhook secret header
// // - Skips processing for non-recipe webhooks
// // - Fetches current recipesSummary and only mutates if the summary object differs
// // Env vars expected:
// // - SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID
// // - SANITY_DATASET or NEXT_PUBLIC_SANITY_DATASET
// // - SANITY_TOKEN (required to write)
// // - SANITY_WEBHOOK_SECRET (optional)

// const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || "";

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

// function getUniqueSorted(set) {
//     return Array.from(set).sort((a, b) => a.localeCompare(b));
// }
// // stable stringify that sorts object keys recursively for deterministic comparison
// function stableStringify(obj) {
//     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
//     if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
//     const keys = Object.keys(obj).sort();
//     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
// }

// export async function POST(req) {
//     try {
//         // optional webhook secret verification
//         if (SANITY_WEBHOOK_SECRET) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET) {
//                 console.warn("Rejected webhook: missing or invalid webhook secret header");
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
//                     status: 401,
//                     headers: { "Content-Type": "application/json" },
//                 });
//             }
//         }

//         // parse incoming payload if present
//         let incoming = null;
//         try {
//             incoming = await req.json();
//         } catch {
//             incoming = null;
//         }

//         // ignore if summary was updated (prevent obvious loop)
//         if (incoming && (incoming._id === "recipesSummary" || incoming._type === "recipesSummary")) {
//             console.log("Ignoring webhook triggered by recipesSummary document update to avoid loop.");
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // if provided and not recipe, skip
//         if (incoming && incoming._type && incoming._type !== "recipe") {
//             console.log(`Ignoring webhook for type "${incoming._type}" (only reacts to "recipe").`);
//             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // fetch recipes
//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title}`;
//         console.log("groq fetched from Sanity in aggregate", groq);
//         const query = encodeURIComponent(groq);
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;
//         const fetchOpts = { method: "GET", headers: { "Content-Type": "application/json" } };
//         if (SANITY_TOKEN) fetchOpts.headers.Authorization = `Bearer ${SANITY_TOKEN}`;

//         const resp = await fetch(url, fetchOpts);
//         if (!resp.ok) {
//             const text = await resp.text().catch(() => "");
//             throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText} ${text}`);
//         }
//         const payload = await resp.json();
//         const recipes = Array.isArray(payload.result) ? payload.result : [];

//         // aggregate
//         const productsSet = new Set();
//         const dietarySet = new Set();
//         const cuisineSet = new Set();
//         const tagsSet = new Set();
//         const titlesSet = new Set();

//         for (const r of recipes) {
//             if (Array.isArray(r.products)) {
//                 for (const p of r.products) {
//                     const v = normalizeLower(p);
//                     if (v) productsSet.add(v);
//                 }
//             }
//             if (Array.isArray(r.dietary)) {
//                 for (const d of r.dietary) {
//                     const v = normalizeLower(d);
//                     if (v) dietarySet.add(v);
//                 }
//             }

//             if (Array.isArray(r.cuisine)) {
//                 for (const c of r.cuisine) {
//                     const v = normalizeLower(c);
//                     if (v) cuisineSet.add(v);
//                 }
//             } else if (typeof r.cuisine === "string") {
//                 const v = normalizeLower(r.cuisine);
//                 if (v) cuisineSet.add(v);
//             }
//             if (Array.isArray(r.tags)) {
//                 for (const t of r.tags) {
//                     const v = normalizeLower(t);
//                     if (v) tagsSet.add(v);
//                 }
//             }
//             if (typeof r.title === "string" && r.title.trim() !== "") {
//                 const t = capitalizeFirst(r.title);
//                 if (t) titlesSet.add(t);
//             }
//         }
//         console.log("DIETARY SUMMARY →", Array.from(dietarySet));

//         const uniqueProducts = getUniqueSorted(productsSet);
//         const uniqueDietary = getUniqueSorted(dietarySet);
//         const uniqueCuisines = getUniqueSorted(cuisineSet);
//         const uniqueTags = getUniqueSorted(tagsSet);
//         const uniqueTitles = getUniqueSorted(titlesSet);

//         const totalCount = recipes.length;

//         const summaryDoc = {
//             _id: "recipesSummary",
//             _type: "recipesSummary",
//             totalCount,
//             products: uniqueProducts,
//             dietary: uniqueDietary,
//             cuisines: uniqueCuisines,
//             tags: uniqueTags,
//             titles: uniqueTitles,
//             categories: uniqueCuisines,
//         };

//         // If no token, return aggregated result but don't try to write
//         if (!SANITY_TOKEN) {
//             console.warn("SANITY_TOKEN not provided; skipping upsert. Returning aggregation only.");
//             return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // Fetch current recipesSummary (if exists) and compare
//         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/${encodeURIComponent("recipesSummary")}`;
//         const currentResp = await fetch(docUrl, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });
//         let currentDoc = null;
//         if (currentResp.ok) {
//             try {
//                 currentDoc = await currentResp.json();
//             } catch {
//                 currentDoc = null;
//             }
//         }

//         // Build comparable plain object (exclude Sanity internal fields like _rev, _updatedAt)
//         const cleanDoc = obj => ({
//             totalCount: obj?.totalCount ?? null,
//             products: Array.isArray(obj?.products) ? obj.products : [],
//             dietary: Array.isArray(obj?.dietary) ? obj.dietary : [],
//             cuisines: Array.isArray(obj?.cuisines) ? obj.cuisines : [],
//             tags: Array.isArray(obj?.tags) ? obj.tags : [],
//             titles: Array.isArray(obj?.titles) ? obj.titles : [],
//             categories: Array.isArray(obj?.categories) ? obj.categories : [],
//         });

//         const currentComparable = cleanDoc(currentDoc);
//         const newComparable = cleanDoc(summaryDoc);

//         if (stableStringify(currentComparable) === stableStringify(newComparable)) {
//             console.log("No changes detected in recipesSummary; skipping upsert to avoid triggering webhooks.");
//             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // Proceed to upsert since content differs
//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
//         const mutationBody = { mutations: [{ createOrReplace: summaryDoc }] };
//         const mutateResp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${SANITY_TOKEN}`,
//             },
//             body: JSON.stringify(mutationBody),
//         });

//         const mutateText = await mutateResp.text();
//         let mutateResult;
//         try {
//             mutateResult = JSON.parse(mutateText);
//         } catch {
//             mutateResult = { raw: mutateText };
//         }
//         if (!mutateResp.ok) {
//             console.error("Sanity upsert failed:", mutateResp.status, mutateResp.statusText, mutateResult);
//             throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
//         }

//         console.log("Upserted recipesSummary; aggregated counts:", {
//             recipes: totalCount,
//             products: uniqueProducts.length,
//             dietary: uniqueDietary.length,
//             cuisines: uniqueCuisines.length,
//             tags: uniqueTags.length,
//             titles: uniqueTitles.length,
//         });

//         return new Response(JSON.stringify({ summary: summaryDoc, sanityResult: mutateResult }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         console.error("Aggregation/upsert error:", error);
//         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: error?.message ?? String(error) }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }

///////////////////////////////////////////////////////////
// Refactored TypeScript version, strict mode, no "any"
// File: /app/api/sanity/webhook/route.ts

import type { NextRequest } from "next/server";

const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
const SANITY_WEBHOOK_SECRET: string = process.env.SANITY_WEBHOOK_SECRET || "";

interface RecipeDoc {
    products?: string[];
    dietary?: string[];
    cuisine?: string[] | string;
    tags?: string[];
    title?: string;
}

interface SanityQueryResponse {
    result?: RecipeDoc[];
}

interface SummaryDoc {
    _id: "recipesSummary";
    _type: "recipesSummary";
    totalCount: number;
    products: string[];
    dietary: string[];
    cuisines: string[];
    tags: string[];
    titles: string[];
    categories: string[];
}

interface CurrentDocResponse {
    totalCount?: number;
    products?: string[];
    dietary?: string[];
    cuisines?: string[];
    tags?: string[];
    titles?: string[];
    categories?: string[];
}

function normalizeLower(s: unknown): string | null {
    if (typeof s !== "string") return null;
    const t = s.trim();
    return t ? t.toLowerCase() : null;
}

function capitalizeFirst(s: unknown): string | null {
    if (typeof s !== "string") return null;
    const t = s.trim();
    if (!t) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
}

function getUniqueSorted(set: Set<string>): string[] {
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);

    if (Array.isArray(obj)) {
        return `[${obj.map(stableStringify).join(",")}]`;
    }

    const typedObj = obj as Record<string, unknown>;
    const keys = Object.keys(typedObj).sort();
    return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
}

function cleanDoc(obj: CurrentDocResponse | SummaryDoc | null): CurrentDocResponse {
    return {
        totalCount: typeof obj?.totalCount === "number" ? obj.totalCount : undefined,
        products: Array.isArray(obj?.products) ? obj!.products : [],
        dietary: Array.isArray(obj?.dietary) ? obj!.dietary : [],
        cuisines: Array.isArray(obj?.cuisines) ? obj!.cuisines : [],
        tags: Array.isArray(obj?.tags) ? obj!.tags : [],
        titles: Array.isArray(obj?.titles) ? obj!.titles : [],
        categories: Array.isArray(obj?.categories) ? obj!.categories : [],
    };
}

export async function POST(req: NextRequest) {
    try {
        if (SANITY_WEBHOOK_SECRET) {
            const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();

            if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET) {
                return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        let incoming: Record<string, unknown> | null = null;
        try {
            incoming = await req.json();
        } catch {
            incoming = null;
        }

        if (incoming && (incoming["_id"] === "recipesSummary" || incoming["_type"] === "recipesSummary")) {
            return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
            return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title}`;
        const query = encodeURIComponent(groq);
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

        const fetchOpts: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
            },
        };

        const resp = await fetch(url, fetchOpts);
        if (!resp.ok) {
            throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
        }

        const payload = (await resp.json()) as SanityQueryResponse;
        const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

        const productsSet = new Set<string>();
        const dietarySet = new Set<string>();
        const cuisineSet = new Set<string>();
        const tagsSet = new Set<string>();
        const titlesSet = new Set<string>();

        for (const r of recipes) {
            if (Array.isArray(r.products)) {
                for (const p of r.products) {
                    const v = normalizeLower(p);
                    if (v) productsSet.add(v);
                }
            }

            if (Array.isArray(r.dietary)) {
                for (const d of r.dietary) {
                    const v = normalizeLower(d);
                    if (v) dietarySet.add(v);
                }
            }

            if (Array.isArray(r.cuisine)) {
                for (const c of r.cuisine) {
                    const v = normalizeLower(c);
                    if (v) cuisineSet.add(v);
                }
            } else if (typeof r.cuisine === "string") {
                const v = normalizeLower(r.cuisine);
                if (v) cuisineSet.add(v);
            }

            if (Array.isArray(r.tags)) {
                for (const t of r.tags) {
                    const v = normalizeLower(t);
                    if (v) tagsSet.add(v);
                }
            }

            if (typeof r.title === "string" && r.title.trim()) {
                const t = capitalizeFirst(r.title);
                if (t) titlesSet.add(t);
            }
        }

        const summaryDoc: SummaryDoc = {
            _id: "recipesSummary",
            _type: "recipesSummary",
            totalCount: recipes.length,
            products: getUniqueSorted(productsSet),
            dietary: getUniqueSorted(dietarySet),
            cuisines: getUniqueSorted(cuisineSet),
            tags: getUniqueSorted(tagsSet),
            titles: getUniqueSorted(titlesSet),
            categories: getUniqueSorted(cuisineSet),
        };

        if (!SANITY_TOKEN) {
            return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/recipesSummary`;
        const currentResp = await fetch(docUrl, {
            headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
        });

        let currentDoc: CurrentDocResponse | null = null;
        if (currentResp.ok) {
            try {
                currentDoc = (await currentResp.json()) as CurrentDocResponse;
            } catch {
                currentDoc = null;
            }
        }

        const currentComparable = stableStringify(cleanDoc(currentDoc));
        const newComparable = stableStringify(cleanDoc(summaryDoc));

        if (currentComparable === newComparable) {
            return new Response(JSON.stringify({ ok: "skipped_no_changes" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;

        const mutateResp = await fetch(mutateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SANITY_TOKEN}`,
            },
            body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
        });

        if (!mutateResp.ok) {
            throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
        }

        return new Response(JSON.stringify({ summary: summaryDoc }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
