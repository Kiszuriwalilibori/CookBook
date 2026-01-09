
"use client";
import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import { PageTitle, RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import { useRecipesStore } from "@/stores/useRecipesStore";
import { useAdminStore } from "@/stores/useAdminStore"; 
import { type Recipe } from "@/types";
import { getRecipesForCards } from "@/utils/getRecipesForCards";
import { FilterState } from "@/models/filters";

export default function RecipesClient({ initialRecipes }: { initialRecipes: Recipe[] }) {
    const { hydrated, hydrate, setRecipes } = useRecipesStore();
    const isAdminLogged = useAdminStore(state => state.isAdminLogged);

    // Główny stan wyświetlanych przepisów
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    // 1. Hydratacja z SSR + aktualizacja po zmianie search params
    useEffect(() => {
        if (!hydrated) {
            hydrate(initialRecipes);
            setDisplayRecipes(initialRecipes);
            return;
        }

        // Kolejne zmiany URL (np. po zastosowaniu filtrów)
        setRecipes(initialRecipes);
        setDisplayRecipes(initialRecipes);
    }, [initialRecipes, hydrated, hydrate, setRecipes]);

    // 2. Refetch po zmianie statusu admina
    useEffect(() => {
        let cancelled = false;

        const refetch = async () => {
            try {
                // Admin → bez domyślnego ograniczenia statusu
                // Nie-admin → z domyślnym ograniczeniem
                const filters: Partial<FilterState> = isAdminLogged
                    ? {} // wszystko
                    : { status: ["Good", "Acceptable"] };

                const fresh = await getRecipesForCards(filters);
                if (!cancelled) {
                    setDisplayRecipes(fresh);
                }
            } catch (err) {
                console.error("Refetch po zmianie roli admina nie powiódł się:", err);
            }
        };

        refetch();

        return () => {
            cancelled = true;
        };
    }, [isAdminLogged]);

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