
import { Options } from "@/types/types";

export async function getRecipesSummary(): Promise<{
    initialSummary: Options;
    fetchError: string | null;
}> {
    let initialSummary: Options = { titles: [], cuisines: [], tags: [], dietaryRestrictions: [], products: [] };
    let fetchError: string | null = null;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/recipes-summary`, {
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        initialSummary = await res.json();
    } catch (error) {
        console.error("Failed to prefetch recipes summary:", error);
        fetchError = error instanceof Error ? error.message : "Prefetch failed";
    }

    return { initialSummary, fetchError };
}

export type { Options as OptionsState };
