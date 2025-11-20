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
//             const incomingSecret = (req.headers.get("create-summary-secret") || req.headers.get("create-summary-secret") || "").trim();

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


// File: app/api/create-summary/route.ts
// app/api/create-summary/route.ts
// app/api/create-summary/route.ts
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const SANITY_PROJECT_ID =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your_project_id";
const SANITY_DATASET =
  process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN || "";
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET_CREATE_SUMMARY || "";

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
  _id: "summary";
  _type: "summary";
  totalCount: number;
  products: string[];
  dietary: string[];
  cuisine: string[];
  tags: string[];
  title: string[];
}

interface CurrentDocResponse {
  totalCount?: number;
  products?: string[];
  dietary?: string[];
  cuisine?: string[];
  tags?: string[];
  title?: string[];
}

// ————————————————————————————————————————
// Webhook signature verification (official Sanity way)
function verifySignature(body: string, signatureHeader: string | null): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn("SANITY_WEBHOOK_SECRET_CREATE_SUMMARY not set – skipping verification (dev only)");
    return true;
  }

  if (!signatureHeader?.startsWith("v1=")) return false;

  const provided = signatureHeader.slice(3);
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");

  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

// ————————————————————————————————————————
function normalizeLower(s: unknown): string | null {
  return typeof s === "string" ? s.trim().toLowerCase() || null : null;
}

function capitalizeFirst(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const trimmed = s.trim();
  return trimmed ? trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase() : null;
}

function getUniqueSorted(set: Set<string>): string[] {
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function stableStringify(obj: unknown): string {
  if (obj == null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify((obj as Record<string, unknown>)[k])}`)
    .join(",")}}`;
}

function cleanDoc(doc: CurrentDocResponse | SummaryDoc | null): Partial<SummaryDoc> {
  return {
    totalCount: typeof doc?.totalCount === "number" ? doc.totalCount : undefined,
    products: Array.isArray(doc?.products) ? doc.products : [],
    dietary: Array.isArray(doc?.dietary) ? doc.dietary : [],
    cuisine: Array.isArray(doc?.cuisine) ? doc.cuisine : [],
    tags: Array.isArray(doc?.tags) ? doc.tags : [],
    title: Array.isArray(doc?.title) ? doc.title : [],
  };
}

// ————————————————————————————————————————
export async function POST(req: NextRequest) {
  try {
    // 1. Read raw body first — needed for HMAC verification
    const rawBody = await req.text();

    let incomingPayload: { _id?: string; _type?: string } = {};
    try {
      incomingPayload = JSON.parse(rawBody) as { _id?: string; _type?: string };
    } catch {
      // JSON might be invalid — we still verify signature
    }

    // 2. Verify Sanity webhook signature
    const signature = req.headers.get("sanity-webhook-signature");
    if (!verifySignature(rawBody, signature)) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Skip if this is the summary document updating itself
    if (incomingPayload._id === "summary" || incomingPayload._type === "summary") {
      return new Response(JSON.stringify({ ok: "skipped_self_update" }), { status: 200 });
    }

    // 4. Skip non-recipe changes
    if (incomingPayload._type && incomingPayload._type !== "recipe") {
      return new Response(JSON.stringify({ ok: "skipped_non_recipe" }), { status: 200 });
    }

    // 5. Fetch all recipes
    const groq = `*[_type == "recipe"]{products, dietary, cuisine, tags, title}`;
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;

    const res = await fetch(url, {
      headers: SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {},
    });

    if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);

    const { result: recipes = [] } = (await res.json()) as SanityQueryResponse;

    // 6. Aggregate
    const products = new Set<string>();
    const dietarySet = new Set<string>();
    const cuisineSet = new Set<string>();
    const tagsSet = new Set<string>();
    const titlesSet = new Set<string>();

    for (const r of recipes) {
      r.products?.forEach((p) => normalizeLower(p) && productsSet.add(normalizeLower(p)!));
      r.dietary?.forEach((d) => normalizeLower(d) && dietarySet.add(normalizeLower(d)!));

      if (Array.isArray(r.cuisine)) {
        r.cuisine.forEach((c) => normalizeLower(c) && cuisineSet.add(normalizeLower(c)!));
      } else if (typeof r.cuisine === "string") {
        normalizeLower(r.cuisine) && cuisineSet.add(normalizeLower(r.cuisine)!);
      }

      r.tags?.forEach((t) => normalizeLower(t) && tagsSet.add(normalizeLower(t)!));

      if (r.title) {
        const cap = capitalizeFirst(r.title);
        cap && titlesSet.add(cap);
      }
    }

    const newSummary: SummaryDoc = {
      _id: "summary",
      _type: "summary",
      totalCount: recipes.length,
      products: getUniqueSorted(productsSet),
      dietary: getUniqueSorted(dietarySet),
      cuisine: getUniqueSorted(cuisineSet),
      tags: getUniqueSorted(tagsSet),
      title: getUniqueSorted(titlesSet),
    };

    // 7. No write token → just return the computed summary (great for testing)
    if (!SANITY_TOKEN) {
      return new Response(JSON.stringify({ summary: newSummary, upsert: "skipped_no_token" }), {
        status: 200,
      });
    }

    // 8. Check if anything changed
    const currentRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/doc/${SANITY_DATASET}/summary`,
      { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } }
    );

    let currentDoc: CurrentDocResponse | null = null;
    if (currentRes.ok) {
      try {
        currentDoc = await currentRes.json();
      } catch {}
    }

    if (stableStringify(cleanDoc(currentDoc)) === stableStringify(cleanDoc(newSummary))) {
      return new Response(JSON.stringify({ ok: "skipped_no_changes" }), { status: 200 });
    }

    // 9. Upsert
    const mutateRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/data/mutate/${SANITY_DATASET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SANITY_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [{ createOrReplace: newSummary }],
        }),
      }
    );

    if (!mutateRes.ok) {
      const text = await mutateRes.text();
      throw new Error(`Upsert failed: ${mutateRes.status} – ${text}`);
    }

    return new Response(JSON.stringify({ summary: newSummary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("create-summary webhook error:", msg);
    return new Response(JSON.stringify({ error: "Failed", details: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}