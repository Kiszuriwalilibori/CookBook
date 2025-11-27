// ///////////////////////////////////////////////////////////
// // Refactored TypeScript version, strict mode, no "any"
// // File: /app/api/create-summary/route
// import type { NextRequest } from "next/server";

// const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET_CREATE_SUMMARY: string = process.env.SANITY_WEBHOOK_SECRET_CREATE_SUMMARY || "";

// interface RecipeDoc {
//     products?: string[];
//     dietary?: string[];
//     cuisine?: string[] | string;
//     tags?: string[];
//     title?: string;
// }

// interface SanityQueryResponse {
//     result?: RecipeDoc[];
// }

// interface SummaryDoc {
//     _id: "summary";
//     _type: "summary";
//     totalCount: number;
//     products: string[];
//     dietary: string[];
//     cuisine: string[];
//     tags: string[];
//     title: string[];
// }

// interface CurrentDocResponse {
//     totalCount?: number;
//     products?: string[];
//     dietary?: string[];
//     cuisine?: string[];
//     tags?: string[];
//     title?: string[];
//     categories?: string[];
// }

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

// function getUniqueSorted(set: Set<string>): string[] {
//     return Array.from(set).sort((a, b) => a.localeCompare(b));
// }

// function stableStringify(obj: unknown): string {
//     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);

//     if (Array.isArray(obj)) {
//         return `[${obj.map(stableStringify).join(",")}]`;
//     }

//     const typedObj = obj as Record<string, unknown>;
//     const keys = Object.keys(typedObj).sort();
//     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
// }

// function cleanDoc(obj: CurrentDocResponse | SummaryDoc | null): CurrentDocResponse {
//     return {
//         totalCount: typeof obj?.totalCount === "number" ? obj.totalCount : undefined,
//         products: Array.isArray(obj?.products) ? obj!.products : [],
//         dietary: Array.isArray(obj?.dietary) ? obj!.dietary : [],
//         cuisine: Array.isArray(obj?.cuisine) ? obj!.cuisine : [],
//         tags: Array.isArray(obj?.tags) ? obj!.tags : [],
//         title: Array.isArray(obj?.title) ? obj!.title : [],
//     };
// }

// export async function POST(req: NextRequest) {
//     try {
//         if (SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();

//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
//                     status: 401,
//                     headers: { "Content-Type": "application/json" },
//                 });
//             }
//         }

//         let incoming: Record<string, unknown> | null = null;
//         try {
//             incoming = await req.json();
//         } catch {
//             incoming = null;
//         }

//         if (incoming && (incoming["_id"] === "summary" || incoming["_type"] === "summary")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
//             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title}`;
//         const query = encodeURIComponent(groq);
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

//         const fetchOpts: RequestInit = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
//             },
//         };

//         const resp = await fetch(url, fetchOpts);
//         if (!resp.ok) {
//             throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
//         }

//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

//         const productsSet = new Set<string>();
//         const dietarySet = new Set<string>();
//         const cuisineSet = new Set<string>();
//         const tagsSet = new Set<string>();
//         const titlesSet = new Set<string>();
//         console.log(payload, "payload");
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

//             if (typeof r.title === "string" && r.title.trim()) {
//                 const t = capitalizeFirst(r.title);
//                 if (t) titlesSet.add(t);
//             }
//         }

//         const summaryDoc: SummaryDoc = {
//             _id: "summary",
//             _type: "summary",
//             totalCount: recipes.length,
//             products: getUniqueSorted(productsSet),
//             dietary: getUniqueSorted(dietarySet),
//             cuisine: getUniqueSorted(cuisineSet),
//             tags: getUniqueSorted(tagsSet),
//             title: getUniqueSorted(titlesSet),
//         };

//         if (!SANITY_TOKEN) {
//             return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/summary`;
//         const currentResp = await fetch(docUrl, {
//             headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
//         });

//         let currentDoc: CurrentDocResponse | null = null;
//         if (currentResp.ok) {
//             try {
//                 currentDoc = (await currentResp.json()) as CurrentDocResponse;
//             } catch {
//                 currentDoc = null;
//             }
//         }

//         const currentComparable = stableStringify(cleanDoc(currentDoc));
//         const newComparable = stableStringify(cleanDoc(summaryDoc));

//         if (currentComparable === newComparable) {
//             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;

//         const mutateResp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${SANITY_TOKEN}`,
//             },
//             body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
//         });

//         if (!mutateResp.ok) {
//             throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
//         }

//         return new Response(JSON.stringify({ summary: summaryDoc }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }

// File: /app/api/create-summary/route
// File: /app/api/create-summary/route
// import type { NextRequest } from "next/server";

// const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET_CREATE_SUMMARY: string = process.env.SANITY_WEBHOOK_SECRET_CREATE_SUMMARY || "";

// interface RecipeDoc {
//     products?: string[];
//     dietary?: string[];
//     cuisine?: string[] | string;
//     tags?: string[];
//     title?: string;
//     source?: {
//         http?: string;
//         book?: string;
//         title?: string;
//         author?: string;
//         where?: string;
//     };
// }

// interface SanityQueryResponse {
//     result?: RecipeDoc[];
// }

// // Flat summary (string-array fields)
// interface SummaryDoc {
//     _id: "summary";
//     _type: "summary";
//     totalCount: number;
//     products: string[];
//     dietary: string[];
//     cuisine: string[];
//     tags: string[];
//     title: string[];
//     "source.http": string[];
//     "source.book": string[];
//     "source.title": string[];
//     "source.author": string[];
//     "source.where": string[];
// }

// // Partial shape for the current doc returned by Sanity (unknown JSON)
// type JsonRecord = Record<string, unknown>;

// // Utility normalizers
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
// function normalizeHttp(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     const t = value.trim();
//     return t ? t : null;
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

// // stableStringify (unchanged semantics)
// function stableStringify(obj: unknown): string {
//     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
//     if (Array.isArray(obj)) {
//         return `[${obj.map(stableStringify).join(",")}]`;
//     }

//     const typedObj = obj as Record<string, unknown>;
//     const keys = Object.keys(typedObj).sort();
//     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
// }

// // Typed accessor for reading array fields from a JSON record without using any
// function getArrayField<K extends keyof SummaryDoc>(obj: JsonRecord | null | undefined, key: K): SummaryDoc[K] {
//     if (!obj) return [] as unknown as SummaryDoc[K];
//     const raw = obj[String(key)];
//     if (Array.isArray(raw)) {
//         // We only allow arrays of strings here (per summary design), but validate elements at runtime.
//         const filtered = raw.filter(v => typeof v === "string") as string[];
//         return filtered as unknown as SummaryDoc[K];
//     }
//     return [] as unknown as SummaryDoc[K];
// }

// // Convert current doc (unknown) into the typed shape used for comparison
// function cleanDoc(obj: JsonRecord | null): JsonRecord {
//     // return a plain object with the same keys as SummaryDoc but safe values
//     return {
//         totalCount: typeof obj?.totalCount === "number" ? obj!.totalCount : undefined,
//         products: getArrayField(obj, "products" as keyof SummaryDoc),
//         dietary: getArrayField(obj, "dietary" as keyof SummaryDoc),
//         cuisine: getArrayField(obj, "cuisine" as keyof SummaryDoc),
//         tags: getArrayField(obj, "tags" as keyof SummaryDoc),
//         title: getArrayField(obj, "title" as keyof SummaryDoc),
//         "source.http": getArrayField(obj, "source.http" as keyof SummaryDoc),
//         "source.book": getArrayField(obj, "source.book" as keyof SummaryDoc),
//         "source.title": getArrayField(obj, "source.title" as keyof SummaryDoc),
//         "source.author": getArrayField(obj, "source.author" as keyof SummaryDoc),
//         "source.where": getArrayField(obj, "source.where" as keyof SummaryDoc),
//     };
// }

// export async function POST(req: NextRequest) {
//     try {
//         if (SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
//                     status: 401,
//                     headers: { "Content-Type": "application/json" },
//                 });
//             }
//         }

//         let incoming: Record<string, unknown> | null = null;
//         try {
//             incoming = await req.json();
//         } catch {
//             incoming = null;
//         }

//         if (incoming && (incoming["_id"] === "summary" || incoming["_type"] === "summary")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
//             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // GROQ: fetch all recipes with source
//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, source{
//     http,
//     book,
//     title,
//     author,
//     where
//   }}`;
//         const query = encodeURIComponent(groq);
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

//         const fetchOpts: RequestInit = {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
//             },
//         };

//         const resp = await fetch(url, fetchOpts);
//         if (!resp.ok) {
//             throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
//         }

//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

//         // Accumulators
//         const productsSet = new Set<string>();
//         const dietarySet = new Set<string>();
//         const cuisineSet = new Set<string>();
//         const tagsSet = new Set<string>();
//         const titlesSet = new Set<string>();

//         const sourceHttpSet = new Set<string>();
//         const sourceBookSet = new Set<string>();
//         const sourceTitleSet = new Set<string>();
//         const sourceAuthorSet = new Set<string>();
//         const sourceWhereSet = new Set<string>();

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

//             if (typeof r.title === "string" && r.title.trim()) {
//                 const t = capitalizeFirst(r.title);
//                 if (t) titlesSet.add(t);
//             }

//             if (r.source) {
//                 if (typeof r.source.http === "string") {
//                     const v = normalizeHttp(r.source.http);
//                     if (v) sourceHttpSet.add(v);
//                 }
//                 if (typeof r.source.book === "string") {
//                     const v = normalizeFirstWordCapital(r.source.book);
//                     if (v) sourceBookSet.add(v);
//                 }
//                 if (typeof r.source.title === "string") {
//                     const v = normalizeFirstWordCapital(r.source.title);
//                     if (v) sourceTitleSet.add(v);
//                 }
//                 if (typeof r.source.author === "string") {
//                     const v = normalizeAuthor(r.source.author);
//                     if (v) sourceAuthorSet.add(v);
//                 }
//                 if (typeof r.source.where === "string") {
//                     const v = normalizeWhere(r.source.where);
//                     if (v) sourceWhereSet.add(v);
//                 }
//             }
//         }

//         const summaryDoc: SummaryDoc = {
//             _id: "summary",
//             _type: "summary",
//             totalCount: recipes.length,
//             products: getUniqueSorted(productsSet),
//             dietary: getUniqueSorted(dietarySet),
//             cuisine: getUniqueSorted(cuisineSet),
//             tags: getUniqueSorted(tagsSet),
//             title: getUniqueSorted(titlesSet),
//             "source.http": getUniqueSorted(sourceHttpSet),
//             "source.book": getUniqueSorted(sourceBookSet),
//             "source.title": getUniqueSorted(sourceTitleSet),
//             "source.author": getUniqueSorted(sourceAuthorSet),
//             "source.where": getUniqueSorted(sourceWhereSet),
//         };

//         if (!SANITY_TOKEN) {
//             return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/summary`;
//         const currentResp = await fetch(docUrl, {
//             headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
//         });

//         let currentDocJson: JsonRecord | null = null;
//         if (currentResp.ok) {
//             try {
//                 const parsed = (await currentResp.json()) as unknown;
//                 if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
//                     currentDocJson = parsed as JsonRecord;
//                 } else {
//                     currentDocJson = null;
//                 }
//             } catch {
//                 currentDocJson = null;
//             }
//         }

//         const currentComparable = stableStringify(cleanDoc(currentDocJson));
//         const newComparable = stableStringify(cleanDoc(summaryDoc as unknown as JsonRecord));

//         if (currentComparable === newComparable) {
//             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), {
//                 status: 200,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;

//         const mutateResp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${SANITY_TOKEN}`,
//             },
//             body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
//         });

//         if (!mutateResp.ok) {
//             throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
//         }

//         return new Response(JSON.stringify({ summary: summaryDoc }), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//         });
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }
// }

import type { NextRequest } from "next/server";

const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
const SANITY_WEBHOOK_SECRET_CREATE_SUMMARY: string = process.env.SANITY_WEBHOOK_SECRET_CREATE_SUMMARY || "";

// ---- Types ----
interface RecipeDoc {
    products?: string[];
    dietary?: string[];
    cuisine?: string[] | string;
    tags?: string[];
    title?: string;
    source?: {
        http?: string;
        book?: string;
        title?: string;
        author?: string;
        where?: string;
    };
}

interface SanityQueryResponse {
    result?: RecipeDoc[];
}

interface SummaryDoc {
    _id: "summary";
    _type: "summary";
    totalCount: number;
    products: string[];
    dietary: string[];
    cuisine: string[];
    tags: string[];
    title: string[];
    "source.http": string[];
    "source.book": string[];
    "source.title": string[];
    "source.author": string[];
    "source.where": string[];
}

type JsonRecord = Record<string, unknown>;

// ---- Utilities ----
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
function normalizeHttp(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    return t ? t : null;
}
function normalizeAuthor(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    if (!t) return null;
    return t
        .split(/\s+/)
        .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
        .join(" ");
}
function normalizeFirstWordCapital(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    if (!t) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
}
function normalizeWhere(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const t = value.trim();
    return t ? t.toLowerCase() : null;
}
function getUniqueSorted(set: Set<string>): string[] {
    return Array.from(set).sort((a, b) => a.localeCompare(b));
}
function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
    const typedObj = obj as Record<string, unknown>;
    const keys = Object.keys(typedObj).sort();
    return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
}
function getArrayField<K extends keyof SummaryDoc>(obj: JsonRecord | null | undefined, key: K): SummaryDoc[K] {
    if (!obj) return [] as unknown as SummaryDoc[K];
    const raw = obj[String(key)];
    if (Array.isArray(raw)) {
        const filtered = raw.filter(v => typeof v === "string") as string[];
        return filtered as unknown as SummaryDoc[K];
    }
    return [] as unknown as SummaryDoc[K];
}
function cleanDoc(obj: JsonRecord | null): JsonRecord {
    return {
        totalCount: typeof obj?.totalCount === "number" ? obj!.totalCount : undefined,
        products: getArrayField(obj, "products" as keyof SummaryDoc),
        dietary: getArrayField(obj, "dietary" as keyof SummaryDoc),
        cuisine: getArrayField(obj, "cuisine" as keyof SummaryDoc),
        tags: getArrayField(obj, "tags" as keyof SummaryDoc),
        title: getArrayField(obj, "title" as keyof SummaryDoc),
        "source.http": getArrayField(obj, "source.http" as keyof SummaryDoc),
        "source.book": getArrayField(obj, "source.book" as keyof SummaryDoc),
        "source.title": getArrayField(obj, "source.title" as keyof SummaryDoc),
        "source.author": getArrayField(obj, "source.author" as keyof SummaryDoc),
        "source.where": getArrayField(obj, "source.where" as keyof SummaryDoc),
    };
}

// ---- POST handler ----
export async function POST(req: NextRequest) {
    try {
        console.log("POST /api/create-summary triggered");

        if (SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
            const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
            console.log("Incoming webhook secret present:", !!incomingSecret);
            if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_SUMMARY) {
                console.warn("Invalid webhook secret");
                return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401, headers: { "Content-Type": "application/json" } });
            }
        }

        let incoming: Record<string, unknown> | null = null;
        try {
            incoming = await req.json();
        } catch {
            incoming = null;
        }
        console.log("Incoming payload:", incoming);

        if (incoming && (incoming["_id"] === "summary" || incoming["_type"] === "summary")) {
            console.log("Skipped self update");
            return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
            console.log("Skipped non-recipe document");
            return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, source{http,book,title,author,where}}`;
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
        console.log("Fetching recipes from Sanity:", url);

        const fetchOpts: RequestInit = {
            method: "GET",
            headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) },
        };

        const resp = await fetch(url, fetchOpts);
        console.log("Sanity fetch status:", resp.status);
        if (!resp.ok) {
            const text = await resp.text();
            console.error("Sanity fetch failed:", resp.status, text);
            throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
        }

        const payload = (await resp.json()) as SanityQueryResponse;
        const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];
        console.log("Number of recipes fetched:", recipes.length);

        const productsSet = new Set<string>();
        const dietarySet = new Set<string>();
        const cuisineSet = new Set<string>();
        const tagsSet = new Set<string>();
        const titlesSet = new Set<string>();
        const sourceHttpSet = new Set<string>();
        const sourceBookSet = new Set<string>();
        const sourceTitleSet = new Set<string>();
        const sourceAuthorSet = new Set<string>();
        const sourceWhereSet = new Set<string>();

        for (const r of recipes) {
            if (Array.isArray(r.products))
                for (const p of r.products) {
                    const v = normalizeLower(p);
                    if (v) productsSet.add(v);
                }
            if (Array.isArray(r.dietary))
                for (const d of r.dietary) {
                    const v = normalizeLower(d);
                    if (v) dietarySet.add(v);
                }
            if (Array.isArray(r.cuisine))
                for (const c of r.cuisine) {
                    const v = normalizeLower(c);
                    if (v) cuisineSet.add(v);
                }
            else if (typeof r.cuisine === "string") {
                const v = normalizeLower(r.cuisine);
                if (v) cuisineSet.add(v);
            }
            if (Array.isArray(r.tags))
                for (const t of r.tags) {
                    const v = normalizeLower(t);
                    if (v) tagsSet.add(v);
                }
            if (typeof r.title === "string" && r.title.trim()) {
                const t = capitalizeFirst(r.title);
                if (t) titlesSet.add(t);
            }
            if (r.source) {
                if (typeof r.source.http === "string") {
                    const v = normalizeHttp(r.source.http);
                    if (v) sourceHttpSet.add(v);
                }
                if (typeof r.source.book === "string") {
                    const v = normalizeFirstWordCapital(r.source.book);
                    if (v) sourceBookSet.add(v);
                }
                if (typeof r.source.title === "string") {
                    const v = normalizeFirstWordCapital(r.source.title);
                    if (v) sourceTitleSet.add(v);
                }
                if (typeof r.source.author === "string") {
                    const v = normalizeAuthor(r.source.author);
                    if (v) sourceAuthorSet.add(v);
                }
                if (typeof r.source.where === "string") {
                    const v = normalizeWhere(r.source.where);
                    if (v) sourceWhereSet.add(v);
                }
            }
        }

        const summaryDoc: SummaryDoc = {
            _id: "summary",
            _type: "summary",
            totalCount: recipes.length,
            products: getUniqueSorted(productsSet),
            dietary: getUniqueSorted(dietarySet),
            cuisine: getUniqueSorted(cuisineSet),
            tags: getUniqueSorted(tagsSet),
            title: getUniqueSorted(titlesSet),
            "source.http": getUniqueSorted(sourceHttpSet),
            "source.book": getUniqueSorted(sourceBookSet),
            "source.title": getUniqueSorted(sourceTitleSet),
            "source.author": getUniqueSorted(sourceAuthorSet),
            "source.where": getUniqueSorted(sourceWhereSet),
        };

        console.log("Prepared summary document:", summaryDoc);

        if (!SANITY_TOKEN) {
            console.warn("SANITY_TOKEN missing, skipping upsert");
            return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/summary`;
        console.log("Fetching current summary document:", docUrl);

        const currentResp = await fetch(docUrl, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });
        let currentDocJson: JsonRecord | null = null;
        if (currentResp.ok) {
            try {
                currentDocJson = (await currentResp.json()) as JsonRecord;
            } catch {
                currentDocJson = null;
            }
        }
        console.log("Current summary document:", currentDocJson);

        const currentComparable = stableStringify(cleanDoc(currentDocJson));
        const newComparable = stableStringify(cleanDoc(summaryDoc as unknown as JsonRecord));
        if (currentComparable === newComparable) {
            console.log("No changes detected, skipping upsert");
            return new Response(JSON.stringify({ ok: "skipped_no_changes" }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
        console.log("Upserting summary document:", mutateUrl);

        const mutateResp = await fetch(mutateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${SANITY_TOKEN}` },
            body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
        });

        if (!mutateResp.ok) {
            const text = await mutateResp.text();
            console.error("Sanity upsert failed:", mutateResp.status, text);
            throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
        }

        console.log("Summary successfully upserted");
        return new Response(JSON.stringify({ summary: summaryDoc }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Aggregation/upsert failed:", message);
        return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
