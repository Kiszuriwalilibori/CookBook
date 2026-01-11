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
    cuisine?: string[];
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
