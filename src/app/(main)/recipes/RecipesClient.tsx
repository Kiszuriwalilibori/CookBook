"use client";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { useAdminStore } from "@/stores/useAdminStore";
import { type Recipe } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";

interface RecipesClientProps {
    initialRecipes: Recipe[];
}

export default function RecipesClient({ initialRecipes }: RecipesClientProps) {
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);

    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    // -------------------------------
    // Effect 1: Hydrate SSR data
    // -------------------------------
    useEffect(() => {
        console.log("[Effect 1: Hydration] hydrated with SSR data", {
            initialRecipesCount: initialRecipes.length,
        });
        setDisplayRecipes(initialRecipes);
    }, [initialRecipes]);

    useEffect(() => {
        if (!isAdminLogged) {
            console.log("[Effect 2: Admin logout check] refetching for non-admin");
            let cancelled = false;

            const refetch = async () => {
                try {
                    const filters: Partial<FilterState> = { status: ["Good", "Acceptable"] };
                    const fresh = await getRecipesForCards(filters, isAdminLogged);
                    if (!cancelled) {
                        console.log("[Effect 2: fetched non-admin recipes]", fresh.length);
                        setDisplayRecipes(fresh);
                    }
                } catch (err) {
                    console.error("[Effect 2] refetch failed:", err);
                }
            };

            refetch();

            return () => {
                cancelled = true;
            };
        }
    }, [isAdminLogged]);

    // -------------------------------
    // Effect 3: Admin login or logout → refetch all / filtered
    // -------------------------------
    useEffect(() => {
        console.log("[Effect 3 START] isAdminLogged:", isAdminLogged);
        let cancelled = false;

        const refetch = async () => {
            try {
                const filters: Partial<FilterState> = isAdminLogged
                    ? {} // Admin sees wszystko
                    : { status: ["Good", "Acceptable"] }; // Non-admin domyślnie

                const fresh = await getRecipesForCards(filters, isAdminLogged);
                if (!cancelled) {
                    console.log("[Effect 3 FETCHED] count:", fresh.length);
                    setDisplayRecipes(fresh);
                }
            } catch (err) {
                console.error("[Effect 3] refetch failed:", err);
            }
        };

        refetch();

        return () => {
            cancelled = true;
            console.log("[Effect 3 CLEANUP]");
        };
    }, [isAdminLogged]);

    // -------------------------------
    // Render
    // -------------------------------
    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <PageTitle title="Przepisy" />
                <Typography variant="h6" textAlign="center" mt={4}>
                    Brak przepisów do wyświetlenia.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <PageTitle title="Przepisy" />
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
