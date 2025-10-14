"use client";

import { useState, useEffect } from "react";
import { getRecipes } from "@/lib/sanity";
import { Recipe } from "@/lib/types";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                const data: Recipe[] = await getRecipes();
                setRecipes(data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRecipes();
    }, []);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Recipes</h1>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id}>
                        <h2>{recipe.title}</h2>
                        {/* e.g., Use PortableText component for recipe.description?.content */}
                    </li>
                ))}
            </ul>
        </div>
    );
}
