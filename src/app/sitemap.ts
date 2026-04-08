import { MetadataRoute } from "next";
import { client } from "@/utils";

// Revalidate co 24h (86400 sekund)
export const revalidate = 86400;

interface Recipe {
    _id: string;
    slug: {
        current: string;
    };
    _updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cookbook.example.com";

    try {
        // Fetch all recipes with slug and update date
        const recipes = await client.fetch<Recipe[]>(
            `*[_type == "recipe" && defined(slug.current)] {
        _id,
        slug,
        _updatedAt
      }`
        );

        // Static routes
        const staticRoutes: MetadataRoute.Sitemap = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: 1,
            },
            {
                url: `${baseUrl}/recipes`,
                lastModified: new Date(),
                changeFrequency: "hourly",
                priority: 0.9,
            },
            {
                url: `${baseUrl}/favorites`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.7,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: "monthly",
                priority: 0.5,
            },
        ];

        // Dynamic recipe routes
        const recipeRoutes: MetadataRoute.Sitemap = recipes.map(recipe => ({
            url: `${baseUrl}/recipes/${recipe.slug.current}`,
            lastModified: new Date(recipe._updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }));

        return [...staticRoutes, ...recipeRoutes];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        // Return only static routes if fetch fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: "daily",
                priority: 1,
            },
        ];
    }
}
