import type { Recipe } from "@/types";
import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

export function generateRecipeMetadata(recipe: Recipe) {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
    const recipeUrl = recipe.slug?.current ? `${BASE_URL}/recipes/${recipe.slug.current}` : BASE_URL;
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

    const mainImage = recipe.description?.image?.asset?.url || recipe.preparationSteps?.[0]?.image?.asset?.url || `${BASE_URL}/og-image-default.jpg`;
    const description = extractText(recipe.description?.content).substring(0, 200) || "Przepis kulinarny";
    const ogTitle = `${recipe.title} – sprawdzony przepis`;

    return {
        title: recipe.title,
        authors: [
            {
                name: "Piotr Maksymiuk",
            },
        ],
        description,
        alternates: {
            canonical: recipeUrl,
        },
        openGraph: {
            title: ogTitle,
            description,
            url: recipeUrl,
            type: "article" as const,
            images: [
                {
                    url: `${recipeUrl}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: recipe.title,
                },
            ],

            siteName: "Przepisy Piotra Maksymiuka",
            locale: "pl_PL" as const,
        },
        twitter: {
            card: "summary_large_image" as const,
            title: ogTitle,
            description,
            images: [mainImage],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
