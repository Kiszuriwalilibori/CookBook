// //create-options
// import type { NextRequest } from "next/server";

// const SANITY_PROJECT_ID: string = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET: string = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN: string = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET_CREATE_OPTIONS: string = process.env.SANITY_WEBHOOK_SECRET_CREATE_OPTIONS || "";

// // ---- Types ----
// interface RecipeDoc {
//     products?: string[];
//     dietary?: string[];
//     cuisine?: string[] | string;
//     tags?: string[];
//     title?: string;
//     status?: string;
//     source?: {
//         url?: string[];
//         book?: string[];
//         title?: string[];
//         author?: string[];
//         where?: string[];
//     };
// }

// interface SanityQueryResponse {
//     result?: RecipeDoc[];
// }

// type JsonRecord = Record<string, unknown>;

// // ---- Utilities ----
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

// // Compare objects deterministically
// function stableStringify(obj: unknown): string {
//     if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
//     if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
//     const typedObj = obj as Record<string, unknown>;
//     const keys = Object.keys(typedObj).sort();
//     return `{${keys.map(k => `${JSON.stringify(k)}:${stableStringify(typedObj[k])}`).join(",")}}`;
// }

// // ---- POST handler ----
// export async function POST(req: NextRequest) {
//     try {
//         console.log("POST /api/create-options triggered");

//         // Verify webhook secret
//         if (SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401, headers: { "Content-Type": "application/json" } });
//             }
//         }

//         let incoming: Record<string, unknown> | null = null;
//         try {
//             incoming = await req.json();
//         } catch {
//             incoming = null;
//         }

//         if (incoming && (incoming["_id"] === "options" || incoming["_type"] === "options")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }
//         if (incoming && typeof incoming["_type"] === "string" && incoming["_type"] !== "recipe") {
//             return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         // Fetch all recipes
//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, status, source{url,book,title,author,where}}`;
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
//         const resp = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) } });
//         if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status} ${resp.statusText}`);
//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

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
//                 if (typeof r.source.url === "string") {
//                     const v = normalizeUrl(r.source.url);
//                     if (v) setMap.sourceUrl.add(v);
//                 }
//                 if (typeof r.source.book === "string") {
//                     const v = normalizeFirstWordCapital(r.source.book);
//                     if (v) setMap.sourceBook.add(v);
//                 }
//                 if (typeof r.source.title === "string") {
//                     const v = normalizeFirstWordCapital(r.source.title);
//                     if (v) setMap.sourceTitle.add(v);
//                 }
//                 if (typeof r.source.author === "string") {
//                     const v = normalizeAuthor(r.source.author);
//                     if (v) setMap.sourceAuthor.add(v);
//                 }
//                 if (typeof r.source.where === "string") {
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
//         const goodSets = {
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

//         for (const r of recipes) {
//             accumulate(r, fullSets);
//             if (r.status === "Good" || r.status === "Acceptable") accumulate(r, goodSets);
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

//         console.log("Prepared options document with both versions:", summaryDoc);

//         if (!SANITY_TOKEN) {
//             console.warn("SANITY_TOKEN missing, skipping upsert");
//             return new Response(JSON.stringify({ options: summaryDoc, upsert: "skipped_no_token" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         // Fetch current summary
//         const docUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/options`;
//         const currentResp = await fetch(docUrl, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });
//         let currentDocJson: JsonRecord | null = null;
//         if (currentResp.ok) {
//             try {
//                 currentDocJson = await currentResp.json();
//             } catch {
//                 currentDocJson = null;
//             }
//         }

//         const currentComparable = stableStringify(currentDocJson);
//         const newComparable = stableStringify(summaryDoc);
//         if (currentComparable === newComparable) {
//             console.log("No changes detected, skipping upsert");
//             return new Response(JSON.stringify({ ok: "skipped_no_changes" }), { status: 200, headers: { "Content-Type": "application/json" } });
//         }

//         // Upsert options
//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
//         const mutateResp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", Authorization: `Bearer ${SANITY_TOKEN}` },
//             body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
//         });

//         if (!mutateResp.ok) {
//             const text = await mutateResp.text();
//             throw new Error(`Sanity upsert failed: ${mutateResp.status} ${mutateResp.statusText} ${text}`);
//         }

//         console.log("Options successfully upserted");
//         return new Response(JSON.stringify({ options: summaryDoc }), { status: 200, headers: { "Content-Type": "application/json" } });
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         console.error("Aggregation/upsert failed:", message);
//         return new Response(JSON.stringify({ error: "Aggregation/upsert failed", details: message }), { status: 500, headers: { "Content-Type": "application/json" } });
//     }
// }

// app/api/create-options/route.ts
// app/api/create-options/route.ts
// app/api/create-options/route.ts

// app/api/create-options/route.ts
// import type { NextRequest } from "next/server";
// import { calculateNutritionFromIngredients } from "@/utils/fatsecret";

// // === Sanity config ===
// const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
// const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// const SANITY_TOKEN = process.env.SANITY_TOKEN || "";
// const SANITY_WEBHOOK_SECRET_CREATE_OPTIONS = process.env.SANITY_WEBHOOK_SECRET_CREATE_OPTIONS || "";

// // === Typy i utility (Twoje oryginalne) ===
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

// // === Typ dla ingredients ===
// interface Ingredient {
//     name: string;
//     quantity: number;
//     unit?: string;
//     excluded: boolean;
// }

// // === Aktualizacja nutrition (z pełnym logowaniem) ===
// async function updateRecipeNutrition(recipeId: string, ingredients: Ingredient[]) {
//     if (!SANITY_TOKEN) {
//         console.warn("Brak SANITY_TOKEN – pomijam obliczenia nutrition");
//         return;
//     }

//     if (ingredients.length === 0) {
//         console.log(`Przepis ${recipeId} nie ma składników – pomijam nutrition`);
//         return;
//     }

//     try {
//         console.log(`Rozpoczynam obliczanie nutrition dla ${recipeId} – ${ingredients.length} składników`);
//         const result = await calculateNutritionFromIngredients(ingredients);
//         console.log(`FatSecret zwrócił: ${result.totalWeight}g, ${result.per100g.calories} kcal/100g`);

//         const patchBody = {
//             mutations: [
//                 {
//                     patch: {
//                         id: recipeId,
//                         set: {
//                             nutrition: {
//                                 per100g: result.per100g,
//                                 totalWeight: result.totalWeight,
//                                 calculatedAt: new Date().toISOString(),
//                             },
//                         },
//                     },
//                 },
//             ],
//         };

//         const mutateUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`;
//         const resp = await fetch(mutateUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${SANITY_TOKEN}`,
//             },
//             body: JSON.stringify(patchBody),
//         });

//         if (!resp.ok) {
//             const text = await resp.text();
//             console.error("Błąd zapisu nutrition do Sanity:", resp.status, text);
//         } else {
//             console.log(`Nutrition ZAPISANE – ${recipeId} | ${result.totalWeight}g | ${result.per100g.calories} kcal/100g`);
//         }
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         console.error("BŁĄD FATSECRET:", message);
//     }
// }

// // === GŁÓWNY HANDLER ===
// export async function POST(req: NextRequest) {
//     try {
//         console.log("Webhook /api/create-options – start");

//         // Weryfikacja secretu
//         if (SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//             const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
//             if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
//                 return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401 });
//             }
//         }

//         const incoming = await req.json().catch(() => null);

//         // Pomijamy aktualizację samego dokumentu options
//         if (incoming && (incoming["_id"] === "options" || incoming["_type"] === "options")) {
//             return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200 });
//         }

//         // === KAŻDY DOKUMENT Z _id (oprócz options) → traktujemy jako przepis i przeliczamy nutrition ===
//         const recipeId = incoming?._id as string | undefined;
//         // === Przetwarzanie nutrition – poprawione zapytanie z parametrem $id ===
//         if (recipeId && recipeId !== "options") {
//             console.log(`Przetwarzam nutrition dla przepisu: ${recipeId}`);

//             const query = `*[_id == $id][0]{ ingredients[] { name, quantity, unit, excluded } }`;
//             const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}`;

//             try {
//                 const resp = await fetch(url, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${SANITY_TOKEN}`,
//                     },
//                     body: JSON.stringify({
//                         query,
//                         params: { id: recipeId }, // ← KLUCZOWA LINIA!
//                     }),
//                 });

//                 if (!resp.ok) {
//                     const text = await resp.text();
//                     console.error(`Błąd pobierania składników: ${resp.status} – ${text}`);
//                 } else {
//                     const data = await resp.json();
//                     const ingredients: Ingredient[] = data.result?.ingredients || [];

//                     if (ingredients.length === 0) {
//                         console.log(`Przepis ${recipeId} nie ma składników – pomijam nutrition`);
//                     } else {
//                         console.log(`Znaleziono ${ingredients.length} składników – uruchamiam FatSecret`);
//                         await updateRecipeNutrition(recipeId, ingredients);
//                     }
//                 }
//             } catch (err) {
//                 console.error("Błąd podczas pobierania przepisu:", err);
//             }
//         }

//         // === Stara logika options – działa zawsze ===
//         const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, status, source{url,book,title,author,where}}`;
//         const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
//         const resp = await fetch(url, {
//             method: "GET",
//             headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) },
//         });
//         if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status}`);

//         const payload = (await resp.json()) as SanityQueryResponse;
//         const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

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
//                 if (typeof r.source.url === "string") {
//                     const v = normalizeUrl(r.source.url);
//                     if (v) setMap.sourceUrl.add(v);
//                 }
//                 if (typeof r.source.book === "string") {
//                     const v = normalizeFirstWordCapital(r.source.book);
//                     if (v) setMap.sourceBook.add(v);
//                 }
//                 if (typeof r.source.title === "string") {
//                     const v = normalizeFirstWordCapital(r.source.title);
//                     if (v) setMap.sourceTitle.add(v);
//                 }
//                 if (typeof r.source.author === "string") {
//                     const v = normalizeAuthor(r.source.author);
//                     if (v) setMap.sourceAuthor.add(v);
//                 }
//                 if (typeof r.source.where === "string") {
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
//             if (r.status === "Good" || r.status === "Acceptable") accumulate(r, goodSets);
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

//         if (SANITY_TOKEN) {
//             const currentResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/options`, { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } });
//             let currentDocJson: JsonRecord | null = null;
//             if (currentResp.ok) currentDocJson = await currentResp.json().catch(() => null);

//             if (stableStringify(currentDocJson) !== stableStringify(summaryDoc)) {
//                 const mutateResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json", Authorization: `Bearer ${SANITY_TOKEN}` },
//                     body: JSON.stringify({ mutations: [{ createOrReplace: summaryDoc }] }),
//                 });
//                 if (mutateResp.ok) console.log("Options upserted");
//             }
//         }

//         return new Response(JSON.stringify({ ok: "done" }), { status: 200 });
//     } catch (error) {
//         console.error("Webhook error:", error);
//         return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
//     }
// }

import type { NextRequest } from "next/server";
// import { calculateNutritionFromIngredients } from "@/utils/fatsecret";  // ⛔ disabled

// === Sanity config ===
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN || "";
const SANITY_WEBHOOK_SECRET_CREATE_OPTIONS = process.env.SANITY_WEBHOOK_SECRET_CREATE_OPTIONS || "";

// === Typy i utility ===
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

// --- normalizers ---
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
function normalizeUrl(value: unknown): string | null {
    if (typeof value !== "string") return null;
    return value.trim() || null;
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

// === GŁÓWNY HANDLER ===
export async function POST(req: NextRequest) {
    try {
        console.log("Webhook /api/create-options – start");

        // Weryfikacja secretu
        if (SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
            const incomingSecret = (req.headers.get("x-webhook-secret") || req.headers.get("x-sanity-webhook-secret") || "").trim();
            if (!incomingSecret || incomingSecret !== SANITY_WEBHOOK_SECRET_CREATE_OPTIONS) {
                return new Response(JSON.stringify({ error: "Invalid webhook secret" }), { status: 401 });
            }
        }

        const incoming = await req.json().catch(() => null);

        // Jeśli webhook zaktualizował options — ignorujemy
        if (incoming && (incoming["_id"] === "options" || incoming["_type"] === "options")) {
            return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200 });
        }

        // ===================================================
        //      ⛔ NUTRITION FUNCTIONALITY DISABLED
        // ===================================================
        //
        // Everything related to fetching recipe ingredients,
        // running calculateNutritionFromIngredients(),
        // and patching nutrition is **commented out below**.
        //
        // const recipeId = incoming?._id as string | undefined;
        //
        // if (recipeId && recipeId !== "options") {
        //     console.log(`(DISABLED) Would update nutrition for ${recipeId}`);
        //
        //     const query = `*[_id == $id][0]{ ingredients[] { name, quantity, unit, excluded } }`;
        //     const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}`;
        //
        //     const resp = await fetch(url, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${SANITY_TOKEN}`,
        //         },
        //         body: JSON.stringify({
        //             query,
        //             params: { id: recipeId },
        //         }),
        //     });
        //
        //     const data = await resp.json();
        //     const ingredients = data.result?.ingredients || [];
        //
        //     if (ingredients.length > 0) {
        //         console.log("Nutrition update skipped (disabled)");
        //     }
        // }
        // ===================================================

        // ================ OPTIONS UPDATE (unchanged) ================
        const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title, status, source{url,book,title,author,where}}`;
        const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
        const resp = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json", ...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {}) },
        });
        if (!resp.ok) throw new Error(`Sanity read failed: ${resp.status}`);

        const payload = (await resp.json()) as SanityQueryResponse;
        const recipes: RecipeDoc[] = Array.isArray(payload.result) ? payload.result : [];

        const accumulate = (r: RecipeDoc, setMap: Record<string, Set<string>>) => {
            if (Array.isArray(r.products))
                r.products.forEach(p => {
                    const v = normalizeLower(p);
                    if (v) setMap.products.add(v);
                });
            if (Array.isArray(r.dietary))
                r.dietary.forEach(d => {
                    const v = normalizeLower(d);
                    if (v) setMap.dietary.add(v);
                });
            if (Array.isArray(r.tags))
                r.tags.forEach(t => {
                    const v = normalizeLower(t);
                    if (v) setMap.tags.add(v);
                });
            if (Array.isArray(r.cuisine))
                r.cuisine.forEach(c => {
                    const v = normalizeLower(c);
                    if (v) setMap.cuisine.add(v);
                });
            else if (typeof r.cuisine === "string") {
                const v = normalizeLower(r.cuisine);
                if (v) setMap.cuisine.add(v);
            }
            if (typeof r.title === "string" && r.title.trim()) {
                const v = capitalizeFirst(r.title);
                if (v) setMap.title.add(v);
            }
            if (r.source) {
                if (typeof r.source.url === "string") {
                    const v = normalizeUrl(r.source.url);
                    if (v) setMap.sourceUrl.add(v);
                }
                if (typeof r.source.book === "string") {
                    const v = normalizeFirstWordCapital(r.source.book);
                    if (v) setMap.sourceBook.add(v);
                }
                if (typeof r.source.title === "string") {
                    const v = normalizeFirstWordCapital(r.source.title);
                    if (v) setMap.sourceTitle.add(v);
                }
                if (typeof r.source.author === "string") {
                    const v = normalizeAuthor(r.source.author);
                    if (v) setMap.sourceAuthor.add(v);
                }
                if (typeof r.source.where === "string") {
                    const v = normalizeWhere(r.source.where);
                    if (v) setMap.sourceWhere.add(v);
                }
            }
        };

        const fullSets = {
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
        };
        const goodSets = structuredClone(fullSets);

        for (const r of recipes) {
            accumulate(r, fullSets);
            if (r.status === "Good" || r.status === "Acceptable") accumulate(r, goodSets);
        }

        const summaryDoc: JsonRecord = {
            _id: "options",
            _type: "options",
            fullSummary: {
                products: getUniqueSorted(fullSets.products),
                dietary: getUniqueSorted(fullSets.dietary),
                cuisine: getUniqueSorted(fullSets.cuisine),
                tags: getUniqueSorted(fullSets.tags),
                title: getUniqueSorted(fullSets.title),
                source: {
                    url: getUniqueSorted(fullSets.sourceUrl),
                    book: getUniqueSorted(fullSets.sourceBook),
                    title: getUniqueSorted(fullSets.sourceTitle),
                    author: getUniqueSorted(fullSets.sourceAuthor),
                    where: getUniqueSorted(fullSets.sourceWhere),
                },
            },
            goodSummary: {
                products: getUniqueSorted(goodSets.products),
                dietary: getUniqueSorted(goodSets.dietary),
                cuisine: getUniqueSorted(goodSets.cuisine),
                tags: getUniqueSorted(goodSets.tags),
                title: getUniqueSorted(goodSets.title),
                source: {
                    url: getUniqueSorted(goodSets.sourceUrl),
                    book: getUniqueSorted(goodSets.sourceBook),
                    title: getUniqueSorted(goodSets.sourceTitle),
                    author: getUniqueSorted(goodSets.sourceAuthor),
                    where: getUniqueSorted(goodSets.sourceWhere),
                },
            },
        };

        if (SANITY_TOKEN) {
            const currentResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/options`, {
                headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
            });

            let currentDocJson: JsonRecord | null = null;
            if (currentResp.ok) currentDocJson = await currentResp.json().catch(() => null);

            if (stableStringify(currentDocJson) !== stableStringify(summaryDoc)) {
                const mutateResp = await fetch(`https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${SANITY_TOKEN}`,
                    },
                    body: JSON.stringify({
                        mutations: [{ createOrReplace: summaryDoc }],
                    }),
                });
                if (mutateResp.ok) console.log("Options upserted");
            }
        }

        return new Response(JSON.stringify({ ok: "done" }), { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
    }
}
