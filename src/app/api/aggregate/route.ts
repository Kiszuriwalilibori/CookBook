// // ///////////////////////////////////////////////////////////
// // // Refactored TypeScript version, strict mode, no "any"
// // // File: /app/api/sanity/webhook/route.ts

// // import type { NextRequest } from "next/server";

// // const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// // const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// // const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
// // const SANITY_WEBHOOK_SECRET: string = process.env.SANITY_WEBHOOK_SECRET || "";

// // interface RecipeDoc {
// //     products?: string[];
// //     dietary?: string[];
// //     cuisine?: string[] | string;
// //     tags?: string[];
// //     title?: string;
// // }

// // interface SanityQueryResponse {
// //     result?: RecipeDoc[];
// // }

// // interface SummaryDoc {
// //     _id: "summary";
// //     _type: "summary";
// //     totalCount: number;
// //     products: string[];
// //     dietary: string[];
// //     cuisines: string[];
// //     tags: string[];
// //     titles: string[];
// //     categories: string[];
// // }

// // interface CurrentDocResponse {
// //     totalCount?: number;
// //     products?: string[];
// //     dietary?: string[];
// //     cuisines?: string[];
// //     tags?: string[];
// //     titles?: string[];
// //     categories?: string[];
// // }

// // function normalizeLower(s: unknown): string | null {
// //     if (typeof s !== "string") return null;
// //     const t = s.trim();
// //     return t ? t.toLowerCase() : null;
// // }

// // function capitalizeFirst(s: unknown): string | null {
// //     if (typeof s !== "string") return null;
// //     const t = s.trim();
// //     if (!t) return null;
// //     return t.charAt(0).toUpperCase() + t.slice(1);
// // }

// // function getUniqueSorted(set: Set<string>): string[] {
// //     return Array.from(set).sort((a, b) => a.localeCompare(b));
// // }

// // function stableStringify(obj: unknown): string {
// //     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);

// //     if (Array.isArray(obj)) {
// //         return `[${obj.map(stableStringify).join(",")}]`;
// //     }

// //     const typedObj = obj as Record<string, unknown>;
// //     const keys = Object.keys(typedObj).sort();
// //     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
// // }

// // function cleanDoc(obj: CurrentDocResponse | SummaryDoc | null): CurrentDocResponse {
// //     return {
// //         totalCount: typeof obj?.totalCount === "number" ? obj.totalCount : undefined,
// //         products: Array.isArray(obj?.products) ? obj!.products : [],
// //         dietary: Array.isArray(obj?.dietary) ? obj!.dietary : [],
// //         cuisines: Array.isArray(obj?.cuisines) ? obj!.cuisines : [],
// //         tags: Array.isArray(obj?.tags) ? obj!.tags : [],
// //         titles: Array.isArray(obj?.titles) ? obj!.titles : [],
// //         categories: Array.isArray(obj?.categories) ? obj!.categories : [],
// //     };
// // }

// // export async function POST(req: NextRequest) {
// //     try {
// //         if (SANITY_WEBHOOK_SECRET) {
// //             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();

// //             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET) {
// //                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
// //                     status: 401,
// //                     headers: { "Content-Type": "application/json" },
// //                 });
// //             }
// //         }

// //         let incoming: Record<string, unknown> | null = null;
// //         try {
// //             incoming = await req.json();
// //         } catch {
// //             incoming = null;
// //         }

// //         if (incoming && (incoming["_id"] === "recipesSummary" || incoming["_type"] === "recipesSummary")) {
// //             return new Response(JSON.stringify({ ok: "skipped_self_update" }), {
// //                 status: 200,
// //                 headers: { "Content-Type": "application/json" },
// //             });
// //         }

// //         if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
// //             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), {
// //                 status: 200,
// //                 headers: { "Content-Type": "application/json" },
// //             });
// //         }

// //         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title}`;
// //         const query = encodeURIComponent(groq);
// //         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

// //         const fetchOpts: RequestInit = {
// //             method: "GET",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}),
// //             },
// //         };

// //         const resp = await fetch(url, fetchOpts);
// //         if (!resp.ok) {
// //             throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
// //         }

// //         const payload = (await resp.json()) as SanityQueryResponse;
// //         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

// //         const productsSet = new Set<string>();
// //         const dietarySet = new Set<string>();
// //         const cuisineSet = new Set<string>();
// //         const tagsSet = new Set<string>();
// //         const titlesSet = new Set<string>();

// //         for (const r of recipes) {
// //             if (Array.isArray(r.products)) {
// //                 for (const p of r.products) {
// //                     const v = normalizeLower(p);
// //                     if (v) productsSet.add(v);
// //                 }
// //             }

// //             if (Array.isArray(r.dietary)) {
// //                 for (const d of r.dietary) {
// //                     const v = normalizeLower(d);
// //                     if (v) dietarySet.add(v);
// //                 }
// //             }

// //             if (Array.isArray(r.cuisine)) {
// //                 for (const c of r.cuisine) {
// //                     const v = normalizeLower(c);
// //                     if (v) cuisineSet.add(v);
// //                 }
// //             } else if (typeof r.cuisine === "string") {
// //                 const v = normalizeLower(r.cuisine);
// //                 if (v) cuisineSet.add(v);
// //             }

// //             if (Array.isArray(r.tags)) {
// //                 for (const t of r.tags) {
// //                     const v = normalizeLower(t);
// //                     if (v) tagsSet.add(v);
// //                 }
// //             }

// //             if (typeof r.title === "string" && r.title.trim()) {
// //                 const t = capitalizeFirst(r.title);
// //                 if (t) titlesSet.add(t);
// //             }
// //         }

// //         const summaryDoc: SummaryDoc = {
// //             _id: "summary",
// //             _type: "summary",
// //             totalCount: recipes.length,
// //             products: getUniqueSorted(productsSet),
// //             dietary: getUniqueSorted(dietarySet),
// //             cuisines: getUniqueSorted(cuisineSet),
// //             tags: getUniqueSorted(tagsSet),
// //             titles: getUniqueSorted(titlesSet),
// //             categories: getUniqueSorted(cuisineSet),
// //         };

// //         if (!SANITY_TOKEN) {
// //             return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), {
// //                 status: 200,
// //                 headers: { "Content-Type": "application/json" },
// //             });
// //         }

// //         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/recipesSummary`;
// //         const currentResp = await fetch(docUrl, {
// //             headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
// //         });

// //         let currentDoc: CurrentDocResponse | null = null;
// //         if (currentResp.ok) {
// //             try {
// //                 currentDoc = (await currentResp.json()) as CurrentDocResponse;
// //             } catch {
// //                 currentDoc = null;
// //             }
// //         }

// //         const currentComparable = stableStringify(cleanDoc(currentDoc));
// //         const newComparable = stableStringify(cleanDoc(summaryDoc));

// //         if (currentComparable === newComparable) {
// //             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), {
// //                 status: 200,
// //                 headers: { "Content-Type": "application/json" },
// //             });
// //         }

// //         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;

// //         const mutateResp = await fetch(mutateUrl, {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${SANITY_TOKEN}`,
// //             },
// //             body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
// //         });

// //         if (!mutateResp.ok) {
// //             throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);
// //         }

// //         return new Response(JSON.stringify({ summary: summaryDoc }), {
// //             status: 200,
// //             headers: { "Content-Type": "application/json" },
// //         });
// //     } catch (error) {
// //         const message = error instanceof Error ? error.message : String(error);
// //         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), {
// //             status: 500,
// //             headers: { "Content-Type": "application/json" },
// //         });
// //     }
// // }

// import type { NextRequest } from "next/server";

// const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET: string = process.env.SANITY_WEBHOOK_SECRET || "";

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
// type CurrentDocResponse = Partial<Omit<SummaryDoc, "_id" | "_type">>;

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
//     return t || null;
// }

// function normalizeFirstWordCapital(value: unknown): string | null {
//     if (typeof value !== "string") return null;
//     const t = value.trim();
//     if (!t) return null;
//     return t.charAt(0).toUpperCase() + t.slice(1);
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

// function cleanDoc(obj: CurrentDocResponse | SummaryDoc | null): CurrentDocResponse {
//     return {
//         totalCount: typeof obj?.totalCount === "number" ? obj.totalCount : undefined,
//         products: Array.isArray(obj?.products) ? obj.products : [],
//         dietary: Array.isArray(obj?.dietary) ? obj.dietary : [],
//         cuisine: Array.isArray(obj?.cuisine) ? obj.cuisine : [],
//         tags: Array.isArray(obj?.tags) ? obj.tags : [],
//         title: Array.isArray(obj?.title) ? obj.title : [],
//         "source.http": Array.isArray(obj?.["source.http"]) ? obj["source.http"] : [],
//         "source.book": Array.isArray(obj?.["source.book"]) ? obj["source.book"] : [],
//         "source.title": Array.isArray(obj?.["source.title"]) ? obj["source.title"] : [],
//         "source.author": Array.isArray(obj?.["source.author"]) ? obj["source.author"] : [],
//         "source.where": Array.isArray(obj?.["source.where"]) ? obj["source.where"] : [],
//     };
// }

// export async function POST(req: NextRequest) {
//     try {
//         if (SANITY_WEBHOOK_SECRET) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401, headers: { "Content-Type": "application/json" } });
//             }
//         }

//         let incoming: Record<string, unknown> | null = null;
//         try {
//             incoming = await req.json();
//         } catch {
//             incoming = null;
//         }

//         if (incoming && (incoming["_id"] === "summary" || incoming["_type"] === "summary")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
//             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, source}`;
//         const query = encodeURIComponent(groq);
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${query}`;

//         const resp = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) } });
//         if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);

//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

//         const productsSet = new Set<string>();
//         const dietarySet = new Set<string>();
//         const cuisineSet = new Set<string>();
//         const tagsSet = new Set<string>();
//         const titleSet = new Set<string>();
//         const sourceHttpSet = new Set<string>();
//         const sourceBookSet = new Set<string>();
//         const sourceTitleSet = new Set<string>();
//         const sourceAuthorSet = new Set<string>();
//         const sourceWhereSet = new Set<string>();

//         for (const r of recipes) {
//             if (Array.isArray(r.products))
//                 for (const p of r.products) {
//                     const v = normalizeLower(p);
//                     if (v) productsSet.add(v);
//                 }
//             if (Array.isArray(r.dietary))
//                 for (const d of r.dietary) {
//                     const v = normalizeLower(d);
//                     if (v) dietarySet.add(v);
//                 }
//             if (Array.isArray(r.cuisine))
//                 for (const c of r.cuisine) {
//                     const v = normalizeLower(c);
//                     if (v) cuisineSet.add(v);
//                 }
//             else if (typeof r.cuisine === "string") {
//                 const v = normalizeLower(r.cuisine);
//                 if (v) cuisineSet.add(v);
//             }
//             if (Array.isArray(r.tags))
//                 for (const t of r.tags) {
//                     const v = normalizeLower(t);
//                     if (v) tagsSet.add(v);
//                 }
//             if (typeof r.title === "string" && r.title.trim()) {
//                 const t = capitalizeFirst(r.title);
//                 if (t) titleSet.add(t);
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
//             title: getUniqueSorted(titleSet),
//             "source.http": getUniqueSorted(sourceHttpSet),
//             "source.book": getUniqueSorted(sourceBookSet),
//             "source.title": getUniqueSorted(sourceTitleSet),
//             "source.author": getUniqueSorted(sourceAuthorSet),
//             "source.where": getUniqueSorted(sourceWhereSet),
//         };

//         if (!SANITY_TOKEN) {
//             return new Response(JSON.stringify({ summary: summaryDoc, upsert: "skipped_no_token" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/summary`;
//         const currentResp = await fetch(docUrl, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });

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
//             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
//         const mutateResp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", Authorization: `Bearer ${SANITY_TOKEN}` },
//             body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
//         });

//         if (!mutateResp.ok) throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText}`);

//         return new Response(JSON.stringify({ summary: summaryDoc }), { status: 200, headers: { "Content-Type": "application/json" } });
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), { status: 500, headers: { "Content-Type": "application/json" } });
//     }
// }
