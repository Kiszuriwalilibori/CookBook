// src/app/api/nutrition/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import fetch from "node-fetch";

const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET!;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("FatSecret credentials are missing");
}

// Hardcoded product
const PRODUCT_NAME = "jabłko" as const;

// Minimal types
type Nutrient = {
    nutrient: string;
    value: string;
    unit: string;
};

type FatSecretServing = {
    food_nutrition?: Nutrient | Nutrient[];
};

type FatSecretFood = {
    food_id: string;
    food_name: string;
    servings?: { serving: FatSecretServing | FatSecretServing[] };
};

type FoodsSearchResponse = {
    foods?: { food: FatSecretFood[] };
};

type FoodGetResponse = {
    food?: FatSecretFood;
};

// Manual OAuth 1.0a signing
function signRequest(params: Record<string, string>, method: string, url: string): string {
    const sorted = Object.keys(params)
        .sort()
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join("&");
    const base = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sorted)}`;
    const key = `${CONSUMER_SECRET}&`;
    return crypto.createHmac("sha1", key).update(base).digest("base64");
}

// Helper to make signed GET requests
async function signedGet<T>(url: string, extraParams: Record<string, string> = {}): Promise<T> {
    const oauthParams: Record<string, string> = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: crypto.randomBytes(16).toString("hex"),
        oauth_version: "1.0",
        ...extraParams,
    };

    const signature = signRequest(oauthParams, "GET", url);
    oauthParams.oauth_signature = signature;

    // Build Authorization header
    const authHeader =
        "OAuth " +
        Object.entries(oauthParams)
            .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
            .join(", ");

    const res = await fetch(url, { headers: { Authorization: authHeader } });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return (await res.json()) as T;
}

// Fetch nutrition for PRODUCT_NAME
async function getNutritionForProduct() {
    const searchUrl = "https://platform.fatsecret.com/rest/server.api?method=foods.search&format=json&locale=pl_PL";
    const searchData = await signedGet<FoodsSearchResponse>(searchUrl, { search_expression: PRODUCT_NAME });
    const foods = searchData.foods?.food;
    if (!foods || foods.length === 0) return null;

    const foodId = foods[0].food_id;
    const foodUrl = `https://platform.fatsecret.com/rest/server.api?method=food.get&format=json&food_id=${foodId}`;
    const foodData = await signedGet<FoodGetResponse>(foodUrl);
    const food = foodData.food;
    if (!food) return null;

    const nutrients: Record<string, number> = {};
    if (food.servings?.serving) {
        const serving: FatSecretServing = Array.isArray(food.servings.serving) ? food.servings.serving[0] : food.servings.serving;

        if (serving.food_nutrition) {
            const nutArray: Nutrient[] = Array.isArray(serving.food_nutrition) ? serving.food_nutrition : [serving.food_nutrition];

            nutArray.forEach(n => {
                const name = n.nutrient.toLowerCase();
                const value = parseFloat(n.value);
                if (!isNaN(value)) nutrients[name] = value;
            });
        }
    }

    return {
        name: food.food_name,
        calories: nutrients["energy"] ?? 0,
        protein: nutrients["protein"] ?? 0,
        fat: nutrients["total fat"] ?? 0,
        carbs: nutrients["carbohydrate, by difference"] ?? 0,
        fiber: nutrients["fiber, total dietary"] ?? 0,
    };
}

// API route
export async function GET() {
    try {
        const nutrition = await getNutritionForProduct();
        if (!nutrition) return NextResponse.json({ error: "Food not found" }, { status: 404 });
        return NextResponse.json(nutrition);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch nutrition" }, { status: 500 });
    }
}
