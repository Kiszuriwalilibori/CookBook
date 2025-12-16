import type { Recipe } from "@/types";

import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

export function generateRecipeMetadata(recipe: Recipe) {
    const extractText = (blocks?: PortableTextBlock[]): string => {
        if (!blocks) return "";

        return blocks
            .filter((block): block is PortableTextBlock => block._type === "block")
            .map(block => {
                if (!block.children) return "";
                return block.children
                    .filter((child): child is PortableTextSpan => child._type === "span")
                    .map(span => span.text ?? "")
                    .join("");
            })
            .join(" ")
            .trim();
    };

    const mainImage = recipe.description?.image?.asset?.url || recipe.preparationSteps?.[0]?.image?.asset?.url || "https://yoursite.com/default-og-image.jpg";

    const url = recipe.source?.url || (recipe.slug ? `https://cook-book-inky.vercel.app/recipes/${recipe.slug.current}` : "https://cook-book-inky.vercel.app/");

    const description = extractText(recipe.description?.content).substring(0, 200) || "Przepis kulinarny";

    const nutritionText = recipe.nutrition ? `${recipe.nutrition.per100g.calories} kcal • ${recipe.nutrition.per100g.protein}g B • ${recipe.nutrition.per100g.fat}g T • ${recipe.nutrition.per100g.carbohydrate}g W` : "";

    const ogTitle = nutritionText ? `${recipe.title} • ${nutritionText}` : recipe.title;

    return {
        title: recipe.title,
        description,
        openGraph: {
            title: ogTitle,
            description,
            url,
            type: "article" as const,
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: recipe.title,
                },
            ],
            siteName: "Kiszuriwalilibori gotuje",
            locale: "pl_PL" as const,
        },
        twitter: {
            card: "summary_large_image" as const,
            title: ogTitle,
            description,
            images: [mainImage],
        },
    };
}
