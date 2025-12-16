// src/app/api/nutrition/route.ts
import { NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import fetch from "node-fetch";
// import translateToEnglish from "@/utils/translateToEnglish";

const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET!;

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("FatSecret credentials are missing");
}

// Hardcoded Polish product
const PRODUCT_NAME = "Apple" as const;

type Nutrient = { nutrient: string; value: string; unit: string };

type FatSecretServing = {
    calories?: string;
    protein?: string;
    fat?: string;
    carbohydrate?: string;
    fiber?: string;
    sugar?: string;
    sodium?: string;
    cholesterol?: string;
    saturated_fat?: string;
    polyunsaturated_fat?: string;
    monounsaturated_fat?: string;
    potassium?: string;
    vitamin_a?: string;
    vitamin_c?: string;
    calcium?: string;
    iron?: string;

    // Other optional properties
    measurement_description?: string;
    metric_serving_amount?: string;
    metric_serving_unit?: string;
    number_of_units?: string;
    serving_description?: string;
    serving_id?: string;
    serving_url?: string;

    // Optional nutrition array
    food_nutrition?: Nutrient | Nutrient[];
};

type FatSecretFood = {
    food_id: string;
    food_name: string;
    food_type?: string;
    brand_name?: string;
    servings?: { serving: FatSecretServing | FatSecretServing[] };
    food_url?: string;
    food_description?: string;
};

type FoodsSearchResponse = { foods?: { food: FatSecretFood[] } };
type FoodGetResponse = { food?: FatSecretFood };

function createOAuth() {
    return new OAuth({
        consumer: {
            key: CONSUMER_KEY,
            secret: CONSUMER_SECRET,
        },
        signature_method: "HMAC-SHA1",
        hash_function(base_string: string, key: string) {
            return crypto.createHmac("sha1", key).update(base_string).digest("base64");
        },
    });
}

async function signedGet<T>(url: string, extraParams: Record<string, string>, retry = true): Promise<T> {
    const oauth = createOAuth();

    const requestData = {
        url,
        method: "GET",
        data: extraParams,
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData)) as unknown as HeadersInit;

    try {
        const res = await fetch(`${url}?${new URLSearchParams(extraParams)}`, {
            headers: authHeader,
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (!res.ok || (data && typeof data === "object" && "error" in data)) {
            // Detect timestamp error (code 6) and retry once
            if (retry && data?.error?.code === 6) {
                console.warn("OAuth timestamp error, retrying...");
                // Wait 500ms to avoid same nonce/timestamp
                await new Promise(r => setTimeout(r, 500));
                return signedGet<T>(url, extraParams, false);
            }
            throw new Error(JSON.stringify(data));
        }

        return data as T;
    } catch (err) {
        throw err;
    }
}

// Translate Polish -> English via LibreTranslate

// (async () => {
//     const polishSentence = "Jabłko jest czerwone";
//     const english = await translateToEnglish(polishSentence);
//     console.log("Final translation:", english);
// })();

async function getNutritionForProduct() {
    const baseUrl = "https://platform.fatsecret.com/rest/server.api";
    const productEnglish = "Apple";

    const searchData = await signedGet<FoodsSearchResponse>(baseUrl, {
        method: "foods.search",
        format: "json",
        locale: "en_US",
        search_expression: productEnglish,
    });

    const foods = searchData.foods?.food;
    if (!foods?.length) return null;

    const foodId = foods[0].food_id;

    const foodData = await signedGet<FoodGetResponse>(baseUrl, {
        method: "food.get",
        format: "json",
        food_id: foodId,
    });

    const food = foodData.food;
    if (!food?.servings?.serving) return null;

    const serving = Array.isArray(food.servings.serving) ? food.servings.serving[0] : food.servings.serving;

    // Read directly from serving
    const calories = Number(serving.calories ?? 0);
    const protein = Number(serving.protein ?? 0);
    const fat = Number(serving.fat ?? 0);
    const carbs = Number(serving.carbohydrate ?? 0);
    const fiber = Number(serving.fiber ?? 0);

    console.log("calories", calories, "protein", protein, "fat", fat, "carbs", carbs, "fiber", fiber);

    return {
        name: food.food_name,
        calories,
        protein,
        fat,
        carbs,
        fiber,
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
