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

// Hardcoded Polish product
const PRODUCT_NAME = "jabłko" as const;

// Minimal types
type Nutrient = { nutrient: string; value: string; unit: string };
type FatSecretServing = { food_nutrition?: Nutrient | Nutrient[] };
type FatSecretFood = { food_id: string; food_name: string; servings?: { serving: FatSecretServing | FatSecretServing[] } };
type FoodsSearchResponse = { foods?: { food: FatSecretFood[] } };
type FoodGetResponse = { food?: FatSecretFood };

// OAuth setup
const oauth = new OAuth({
    consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
    signature_method: "HMAC-SHA1",
    hash_function(base_string: string, key: string) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
    },
});

// Signed GET request
async function signedGet<T>(url: string, extraParams: Record<string, string> = {}): Promise<T> {
    const requestData = { url, method: "GET", data: extraParams };
    const headers = oauth.toHeader(oauth.authorize(requestData)) as unknown as Record<string, string>;
    const res = await fetch(url + "?" + new URLSearchParams(extraParams), { headers });

    const text = await res.text();
    console.log("Raw FatSecret response text:", text);

    let data: T;
    try {
        data = JSON.parse(text);
    } catch {
        data = {} as T;
    }

    console.log("Parsed FatSecret response:", data);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return data;
}

// Translate Polish -> English via LibreTranslate
async function translateToEnglish(polishText: string): Promise<string> {
    try {
        const res = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: polishText,
                source: "pl",
                target: "en",
                format: "text",
            }),
        });

        const rawData = await res.json();
        const data = rawData as { translatedText: string };

        console.log(`Translated "${polishText}" -> "${data.translatedText}"`);
        return data.translatedText;
    } catch (err) {
        console.error("Translation failed:", err);
        return polishText; // fallback if translation fails
    }
}

// Fetch nutrition
async function getNutritionForProduct() {
    const baseUrl = "https://platform.fatsecret.com/rest/server.api";

    // Translate Polish -> English
    const productEnglish = await translateToEnglish(PRODUCT_NAME);

    // Search food
    const searchData = await signedGet<FoodsSearchResponse>(baseUrl, {
        method: "foods.search",
        format: "json",
        locale: "en_US",
        search_expression: productEnglish,
    });

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
