// src/lib/schema-org.ts
import type { Recipe } from "@/types";

import type { PortableTextBlock } from "@portabletext/types";

export function generateRecipeSchema(recipe: Recipe) {
    console.log("recipe", recipe);
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

    const url = process.env.NEXT_PUBLIC_SITE_URL && recipe.slug?.current ? `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${recipe.slug.current}` : undefined;

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.title,
        // image: mainImage ? [mainImage] : undefined,
        image: mainImage
            ? {
                  "@type": "ImageObject",
                  url: mainImage,
              }
            : undefined,
        description: extractText(recipe.description?.content),
        author: {
            "@type": "Person",
            name: "Piotr Maksymiuk",
        },
        prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
        cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
        totalTime: recipe.prepTime && recipe.cookTime ? `PT${recipe.prepTime + recipe.cookTime}M` : undefined,
        recipeYield: recipe.recipeYield ? `${recipe.recipeYield} porcji` : undefined,
        recipeCuisine: recipe.cuisine?.join(", "),
        datePublished: recipe._createdAt ? recipe._createdAt : undefined,
        dateModified: recipe._updatedAt ? recipe._updatedAt : undefined,
        keywords: recipe.tags?.join(", "),
        recipeCategory: recipe.tags ? recipe.tags : undefined,
        aggregateRating: recipe.ratingSummary?.count
            ? {
                  "@type": "AggregateRating",
                  ratingValue: recipe.ratingSummary.average,
                  reviewCount: recipe.ratingSummary.count,
              }
            : undefined,

        recipeIngredient: recipe.ingredients?.filter(i => !i.excluded).map(i => `${i.quantity || ""} ${i.unit || ""} ${i.name || ""}`.trim()) || [],

        recipeInstructions:
            recipe.preparationSteps?.map(step => ({
                "@type": "HowToStep" as const,
                text: extractText(step.content),
            })) || [],

        nutrition: recipe.nutrition
            ? {
                  "@type": "NutritionInformation" as const,
                  calories: recipe.nutrition.per100g.calories ? `${recipe.nutrition.per100g.calories} kcal` : undefined,
                  proteinContent: recipe.nutrition.per100g.protein != null ? `${recipe.nutrition.per100g.protein} g` : undefined,
                  fatContent: recipe.nutrition.per100g.fat != null ? `${recipe.nutrition.per100g.fat} g` : undefined,
                  carbohydrateContent: recipe.nutrition.per100g.carbohydrate != null ? `${recipe.nutrition.per100g.carbohydrate} g` : undefined,
                  servingSize: "100 g",
              }
            : undefined,

        url,
        mainEntityOfPage: url
            ? {
                  "@type": "WebPage",
                  "@id": url,
              }
            : undefined,
    };

    // Remove undefined fields
    Object.keys(jsonLd).forEach(key => {
        if (jsonLd[key] === undefined) delete jsonLd[key];
    });

    return jsonLd;
}
