// src/app/api/nutrition/route.ts
import { NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import fetch from "node-fetch";

const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET!;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("FatSecret credentials are missing");
}

// Hardcoded product
const PRODUCT_NAME = "Apple" as const;

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

// Setup OAuth 1.0a
const oauth = new OAuth({
    consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
    signature_method: "HMAC-SHA1",
    hash_function(base_string: string, key: string) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    },
});

// Signed GET request helper
async function signedGet<T>(url: string, extraParams: Record<string, string> = {}): Promise<T> {
    const requestData = {
        url,
        method: "GET",
        data: extraParams,
    };

    // Safe TypeScript cast for headers
    const headers = oauth.toHeader(oauth.authorize(requestData)) as unknown as Record<string, string>;

    const res = await fetch(url + "?" + new URLSearchParams(extraParams), { headers });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();

    // Vercel logging of raw response
    console.log("Raw FatSecret response:", JSON.stringify(data, null, 2));

    return data as T;
}

// Fetch nutrition for PRODUCT_NAME
async function getNutritionForProduct() {
    const baseUrl = "https://platform.fatsecret.com/rest/server.api";

    // Search for the food
    const searchData = await signedGet<FoodsSearchResponse>(baseUrl, {
        method: "foods.search",
        format: "json",
        locale: "pl_PL",
        search_expression: PRODUCT_NAME,
    });

    console.log("Search results:", JSON.stringify(searchData, null, 2));

    const foods = searchData.foods?.food;
    if (!foods || foods.length === 0) return null;

    const foodId = foods[0].food_id;

    // Get food details
    const foodData = await signedGet<FoodGetResponse>(baseUrl, {
        method: "food.get",
        format: "json",
        food_id: foodId,
    });

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
        if (!nutrition) {
            console.warn(`Food not found for "${PRODUCT_NAME}"`);
            return NextResponse.json({ error: "Food not found" }, { status: 404 });
        }
        return NextResponse.json(nutrition);
    } catch (err) {
        console.error("Error fetching nutrition:", err);
        return NextResponse.json({ error: "Failed to fetch nutrition" }, { status: 500 });
    }
}
