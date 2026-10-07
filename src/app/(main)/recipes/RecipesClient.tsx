"use client";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import { PageTitle } from "@/components";
import { RecipeCard } from "@/components/RecipeCard/RecipeCard";

import { useRouter } from "next/navigation";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { EmptyState } from "@/components/EmptyState";

import { gridSize, pageContainerStyle } from "./styles";

import type { Recipe } from "@/types";
import { useAdminRefetch, useHydrateSSR, useNonAdminRefetch } from "./effects";

import { useFavoritesStore } from "@/stores/useFavoritesStore";

interface RecipesClientProps {
    initialRecipes: Recipe[];
    initialFavorites: string[];
    hasActiveFilters: boolean;
}

export default function RecipesClient({ initialRecipes, initialFavorites, hasActiveFilters }: RecipesClientProps) {
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);
    const router = useRouter();
    useHydrateSSR(initialRecipes, setDisplayRecipes);

    useNonAdminRefetch(setDisplayRecipes);
    useAdminRefetch(setDisplayRecipes);
    const hydrated = useFavoritesStore(state => state.hydrated);
    const setFavorites = useFavoritesStore(state => state.setFavorites);

    useEffect(() => {
        if (!hydrated && initialFavorites.length > 0) {
            setFavorites(initialFavorites);
        }
    }, [hydrated, initialFavorites, setFavorites]);

    // if (displayRecipes.length === 0) {
    //     return (
    //         <Box sx={pageContainerStyle}>
    //             <PageTitle title="Przepisy" />
    //             <Typography variant="h6" textAlign="center" mt={4}>
    //                 Brak przepisów do wyświetlenia.
    //             </Typography>
    //         </Box>
    //     );
    // }

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <PageTitle title="Przepisy" />

                {hasActiveFilters ? (
                    <EmptyState icon={<SearchOffIcon />} title="Nie znaleziono przepisów" description="Spróbuj zmienić filtry i wyszukaj ponownie." actionLabel="Wyczyść filtry" onAction={() => router.push("/recipes")} />
                ) : (
                    <Typography variant="h6" textAlign="center" mt={4}>
                        Brak przepisów do wyświetlenia.
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <PageTitle title="Przepisy" />
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid
                        size={gridSize}
                        key={recipe._id}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
