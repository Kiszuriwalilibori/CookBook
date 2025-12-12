// import type { NextRequest } from "next/server";

// // === Sanity config ===
// const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";

// const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// const SANITY_TOKEN = process.env.SANITY_TOKEN || "";

// const SANITY_WEBHOOK_SECRET_CREATE_OPTIONS = process.env.SANITY_WEBHOOK_SECRET_CREATE_OPTIONS || "";

// // === TYPES ===
// interface RecipeDoc {
//     products?: string[];
//     dietary?: string[];
//     cuisine?: string[] | string;
//     tags?: string[];
//     title?: string;
//     status?: string;
//     source?: {
//         url?: string;
//         book?: string;
//         title?: string;
//         author?: string;
//         where?: string;
//     };
// }

// interface SanityQueryResponse {
//     result?: RecipeDoc[];
// }

// type JsonRecord = Record<string, unknown>;

// // === NORMALIZERS ===
// function normalizeLower(s: unknown): string | null {
//     if (typeof s !== "string") return null;
//     const t = s.trim();
//     return t ? t.toLowerCase() : null;
// }
// function capitalizeFirst(s: unknown): string | null {
//     if (typeof s !== "string") return null;
//     const t = s.trim();
//     if (!t) return null;
//     return t.charAt(0).toUpperCase() + t.slice(1);
// }
// function normalizeUrl(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     return value.trim() || null;
// }
// function normalizeAuthor(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     const t = value.trim();
//     if (!t) return null;
//     return t
//         .split(/\s+/)
//         .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
//         .join(" ");
// }
// function normalizeFirstWordCapital(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     const t = value.trim();
//     if (!t) return null;
//     return t.charAt(0).toUpperCase() + t.slice(1);
// }
// function normalizeWhere(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     const t = value.trim();
//     return t ? t.toLowerCase() : null;
// }
// function getUniqueSorted(set: Set<string>): string[] {
//     return Array.from(set).sort((a, b) => a.localeCompare(b));
// }

// function stableStringify(obj: unknown): string {
//     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
//     if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;

//     const typedObj = obj as Record<string, unknown>;
//     const keys = Object.keys(typedObj).sort();

//     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
// }

// // === MAIN HANDLER ===
// export async function POST(req: NextRequest) {
//     try {
//         console.log("Webhook /api/create-options – start");

//         // Verify secret
//         if (SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();

//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
//                     status: 401,
//                 });
//             }
//         }

//         const incoming = await req.json().catch(() => null);

//         // Ignore if webhook modifies the options document itself
//         if (incoming && (incoming._id === "options" || incoming._type === "options")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
//                 status: 200,
//             });
//         }

//         // === ONLY OPTIONS SUMMARY LOGIC BELOW (no nutrition) ===

//         const groq = `*[_type == "recipe"]{
//       products,
//       dietary,
//       cuisine,
//       tags,
//       title,
//       status,
//       source{url,book,title,author,where}
//     }`;

//         const fetchUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;

//         const resp = await fetch(fetchUrl, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
//             },
//         });

//         if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status}`);

//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

//         // Build option sets
//         const accumulate = (r: RecipeDoc, setMap: Record<string, Set<string>>) => {
//             if (Array.isArray(r.products))
//                 r.products.forEach(p => {
//                     const v = normalizeLower(p);
//                     if (v) setMap.products.add(v);
//                 });

//             if (Array.isArray(r.dietary))
//                 r.dietary.forEach(d => {
//                     const v = normalizeLower(d);
//                     if (v) setMap.dietary.add(v);
//                 });

//             if (Array.isArray(r.tags))
//                 r.tags.forEach(t => {
//                     const v = normalizeLower(t);
//                     if (v) setMap.tags.add(v);
//                 });

//             if (Array.isArray(r.cuisine))
//                 r.cuisine.forEach(c => {
//                     const v = normalizeLower(c);
//                     if (v) setMap.cuisine.add(v);
//                 });
//             else if (typeof r.cuisine === "string") {
//                 const v = normalizeLower(r.cuisine);
//                 if (v) setMap.cuisine.add(v);
//             }

//             if (typeof r.title === "string" && r.title.trim()) {
//                 const v = capitalizeFirst(r.title);
//                 if (v) setMap.title.add(v);
//             }

//             if (r.source) {
//                 if (r.source.url) {
//                     const v = normalizeUrl(r.source.url);
//                     if (v) setMap.sourceUrl.add(v);
//                 }
//                 if (r.source.book) {
//                     const v = normalizeFirstWordCapital(r.source.book);
//                     if (v) setMap.sourceBook.add(v);
//                 }
//                 if (r.source.title) {
//                     const v = normalizeFirstWordCapital(r.source.title);
//                     if (v) setMap.sourceTitle.add(v);
//                 }
//                 if (r.source.author) {
//                     const v = normalizeAuthor(r.source.author);
//                     if (v) setMap.sourceAuthor.add(v);
//                 }
//                 if (r.source.where) {
//                     const v = normalizeWhere(r.source.where);
//                     if (v) setMap.sourceWhere.add(v);
//                 }
//             }
//         };

//         const fullSets = {
//             products: new Set<string>(),
//             dietary: new Set<string>(),
//             cuisine: new Set<string>(),
//             tags: new Set<string>(),
//             title: new Set<string>(),
//             sourceUrl: new Set<string>(),
//             sourceBook: new Set<string>(),
//             sourceTitle: new Set<string>(),
//             sourceAuthor: new Set<string>(),
//             sourceWhere: new Set<string>(),
//         };

//         const goodSets = structuredClone(fullSets);

//         for (const r of recipes) {
//             accumulate(r, fullSets);
//             if (r.status === "Good" || r.status === "Acceptable") {
//                 accumulate(r, goodSets);
//             }
//         }

//         const summaryDoc: JsonRecord = {
//             _id: "options",
//             _type: "options",
//             fullSummary: {
//                 products: getUniqueSorted(fullSets.products),
//                 dietary: getUniqueSorted(fullSets.dietary),
//                 cuisine: getUniqueSorted(fullSets.cuisine),
//                 tags: getUniqueSorted(fullSets.tags),
//                 title: getUniqueSorted(fullSets.title),
//                 source: {
//                     url: getUniqueSorted(fullSets.sourceUrl),
//                     book: getUniqueSorted(fullSets.sourceBook),
//                     title: getUniqueSorted(fullSets.sourceTitle),
//                     author: getUniqueSorted(fullSets.sourceAuthor),
//                     where: getUniqueSorted(fullSets.sourceWhere),
//                 },
//             },
//             goodSummary: {
//                 products: getUniqueSorted(goodSets.products),
//                 dietary: getUniqueSorted(goodSets.dietary),
//                 cuisine: getUniqueSorted(goodSets.cuisine),
//                 tags: getUniqueSorted(goodSets.tags),
//                 title: getUniqueSorted(goodSets.title),
//                 source: {
//                     url: getUniqueSorted(goodSets.sourceUrl),
//                     book: getUniqueSorted(goodSets.sourceBook),
//                     title: getUniqueSorted(goodSets.sourceTitle),
//                     author: getUniqueSorted(goodSets.sourceAuthor),
//                     where: getUniqueSorted(goodSets.sourceWhere),
//                 },
//             },
//         };

//         // Compare and update options only if changed
//         if (SANITY_TOKEN) {
//             const currentResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/options`, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });

//             let currentDoc: JsonRecord | null = null;
//             if (currentResp.ok) currentDoc = await currentResp.json().catch(() => null);

//             if (stableStringify(currentDoc) !== stableStringify(summaryDoc)) {
//                 await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${SANITY_TOKEN}`,
//                     },
//                     body: JSON.stringify({
//                         mutations: [{ createOrReplace: summaryDoc }],
//                     }),
//                 });
//                 console.log("Options updated");
//             }
//         }

//         return new Response(JSON.stringify({ ok: "done" }), { status: 200 });
//     } catch (error) {
//         console.error("Webhook error:", error);
//         return new Response(JSON.stringify({ error: "Webhook failed" }), {
//             status: 500,
//         });
//     }
// }

import type { NextRequest } from "next/server";

// === Sanity config ===
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN || "";
const SANITY_WEBHOOK_SECRET_CREATE_OPTIONS = process.env.SANITY_WEBHOOK_SECRET_CREATE_OPTIONS || "";

// === TYPES ===
interface RecipeDoc {
    products?: string[];
    dietary?: string[];
    cuisine?: string[] | string;
    tags?: string[];
    title?: string;
    status?: string;
    source?: {
        url?: string;
        book?: string;
        title?: string;
        author?: string;
        where?: string;
    };
}

interface SanityQueryResponse {
    result?: RecipeDoc[];
}

type JsonRecord = Record<string, unknown>;

// === NORMALIZERS ===
const normalize = {
    lower: (s: unknown) => (typeof s === "string" && s.trim() ? s.trim().toLowerCase() : null),
    firstCapital: (s: unknown) => (typeof s === "string" && s.trim() ? s.trim()[0].toUpperCase() + s.trim().slice(1) : null),
    url: (s: unknown) => (typeof s === "string" && s.trim() ? s.trim() : null),
    author: (s: unknown) => {
        if (typeof s !== "string") return null;
        return (
            s
                .trim()
                .split(/\s+/)
                .map(w => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
                .join(" ") || null
        );
    },
    firstWordCapital: (s: unknown) => (typeof s === "string" && s.trim() ? s.trim()[0].toUpperCase() + s.trim().slice(1) : null),
    where: (s: unknown) => (typeof s === "string" && s.trim() ? s.trim().toLowerCase() : null),
};

// === HELPERS ===
const getUniqueSorted = (set: Set<string>) => Array.from(set).sort((a, b) => a.localeCompare(b));

const stableStringify = (obj: unknown): string => {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;

    const keys = Object.keys(obj as Record<string, unknown>).sort();
    return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify((obj as Record<string, unknown>)[k])}`).join(",")}}`;
};

const createEmptySets = () => ({
    products: new Set<string>(),
    dietary: new Set<string>(),
    cuisine: new Set<string>(),
    tags: new Set<string>(),
    title: new Set<string>(),
    sourceUrl: new Set<string>(),
    sourceBook: new Set<string>(),
    sourceTitle: new Set<string>(),
    sourceAuthor: new Set<string>(),
    sourceWhere: new Set<string>(),
});

// === FIELD MAPPING ===
const fieldNormalizers: Record<string, (value: unknown) => string | null> = {
    products: normalize.lower,
    dietary: normalize.lower,
    cuisine: normalize.lower,
    tags: normalize.lower,
    title: normalize.firstCapital,
};

const sourceFieldNormalizers: Record<string, (value: unknown) => string | null> = {
    url: normalize.url,
    book: normalize.firstWordCapital,
    title: normalize.firstWordCapital,
    author: normalize.author,
    where: normalize.where,
};

// === ACCUMULATE FUNCTION ===
const accumulate = (r: RecipeDoc, setMap: ReturnType<typeof createEmptySets>) => {
    // Top-level fields
    for (const key of Object.keys(fieldNormalizers) as (keyof RecipeDoc)[]) {
        const value = r[key];
        const normalizer = fieldNormalizers[key];
        if (Array.isArray(value)) {
            value.forEach(v => {
                const n = normalizer(v);
                if (n) (setMap[key as keyof typeof setMap] as Set<string>).add(n);
            });
        } else if (value !== undefined) {
            const n = normalizer(value);
            if (n) (setMap[key as keyof typeof setMap] as Set<string>).add(n);
        }
    }

    // Nested source fields (TS-safe indexing)
    if (r.source) {
        for (const key of Object.keys(sourceFieldNormalizers) as (keyof typeof sourceFieldNormalizers)[]) {
            const value = r.source[key as keyof typeof r.source];
            const normalizer = sourceFieldNormalizers[key];
            if (value !== undefined) {
                const n = normalizer(value);
                if (n) (setMap[`source${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof setMap] as Set<string>).add(n);
            }
        }
    }
};

const buildSummary = (sets: ReturnType<typeof createEmptySets>) => ({
    products: getUniqueSorted(sets.products),
    dietary: getUniqueSorted(sets.dietary),
    cuisine: getUniqueSorted(sets.cuisine),
    tags: getUniqueSorted(sets.tags),
    title: getUniqueSorted(sets.title),
    source: {
        url: getUniqueSorted(sets.sourceUrl),
        book: getUniqueSorted(sets.sourceBook),
        title: getUniqueSorted(sets.sourceTitle),
        author: getUniqueSorted(sets.sourceAuthor),
        where: getUniqueSorted(sets.sourceWhere),
    },
});

// === MAIN HANDLER ===
export async function POST(req: NextRequest) {
    try {
        console.log("Webhook /api/create-options – start");

        // Verify secret
        if (SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
            const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
            if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
                return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401 });
            }
        }

        const incoming = await req.json().catch(() => null);

        if (incoming && (incoming._id === "options" || incoming._type === "options")) {
            return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200 });
        }

        const groq = `*[_type == "recipe"]{ products,dietary,cuisine,tags,title,status,source{url,book,title,author,where} }`;
        const fetchUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
        const resp = await fetch(fetchUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) },
        });

        if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status}`);

        const payload = (await resp.json()) as SanityQueryResponse;
        const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

        const fullSets = createEmptySets();
        const goodSets = structuredClone(fullSets);

        recipes.forEach(r => {
            accumulate(r, fullSets);
            if (r.status === "Good" || r.status === "Acceptable") accumulate(r, goodSets);
        });

        const summaryDoc: JsonRecord = {
            _id: "options",
            _type: "options",
            fullSummary: buildSummary(fullSets),
            goodSummary: buildSummary(goodSets),
        };

        if (SANITY_TOKEN) {
            const currentResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/options`, {
                headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
            });
            const currentDoc = currentResp.ok ? await currentResp.json().catch(() => null) : null;

            if (stableStringify(currentDoc) !== stableStringify(summaryDoc)) {
                await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SANITY_TOKEN}` },
                    body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
                });
                console.log("Options updated");
            }
        }

        return new Response(JSON.stringify({ ok: "done" }), { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
    }
}
