// src/lib/schema-org.ts
import type { Recipe } from "@/types";

import type { PortableTextBlock } from "@portabletext/types";

export function generateRecipeSchema(recipe: Recipe) {
    const extractText = (blocks?: PortableTextBlock[]): string => {
        if (!blocks) return "";

        return blocks
            .filter((block): block is PortableTextBlock => block._type === "block")
            .map(block => {
                if (!block.children) return "";
                return block.children
                    .filter((child): child is { _type: "span"; text: string } => child._type === "span")
                    .map(span => span.text)
                    .join("");
            })
            .join(" ")
            .trim();
    };

    const mainImage = recipe.description?.image?.asset?.url || recipe.preparationSteps?.[0]?.image?.asset?.url || undefined;

    const url = recipe.source?.url || (recipe.slug ? `https://yoursite.com/recipes/${recipe.slug.current}` : undefined);

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.title,
        image: mainImage ? [mainImage] : undefined,
        description: extractText(recipe.description?.content),
        author: recipe.source?.author ? { "@type": "Person", name: recipe.source.author } : undefined,
        prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
        cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
        totalTime: recipe.prepTime && recipe.cookTime ? `PT${recipe.prepTime + recipe.cookTime}M` : undefined,
        recipeYield: recipe.recipeYield ? `${recipe.recipeYield} porcji` : undefined,
        recipeCuisine: recipe.cuisine,
        keywords: recipe.tags?.join(", "),

        recipeIngredient: recipe.ingredients?.filter(i => !i.excluded).map(i => `${i.quantity || ""} ${i.unit || ""} ${i.name || ""}`.trim()) || [],

        recipeInstructions:
            recipe.preparationSteps?.map(step => ({
                "@type": "HowToStep" as const,
                text: extractText(step.content),
            })) || [],

        nutrition: recipe.nutrition
            ? {
                  "@type": "NutritionInformation" as const,
                  calories: `${recipe.nutrition.per100g.calories} kcal`,
                  proteinContent: `${recipe.nutrition.per100g.protein} g`,
                  fatContent: `${recipe.nutrition.per100g.fat} g`,
                  carbohydrateContent: `${recipe.nutrition.per100g.carbohydrate} g`,
                  servingSize: "100 g",
              }
            : undefined,

        url,
    };

    // Remove undefined fields
    Object.keys(jsonLd).forEach(key => {
        if (jsonLd[key] === undefined) delete jsonLd[key];
    });

    return jsonLd;
}
