"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { RecipeCard } from "@/components";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";
import { useFavorites } from "@/hooks";
import { useIsUserLogged } from "@/stores/useAdminStore";
interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const router = useRouter();
    const isUserLogged = useIsUserLogged();

    const { favorites, addFavorite, removeFavorite, loading } = useFavorites();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    // CSR: redirect jeśli user wylogowany
    useEffect(() => {
        if (!isUserLogged) {
            router.replace("/");
        }
    }, [isUserLogged, router]);

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography variant="h6" textAlign="center" mt={4}>
                    Nie masz jeszcze ulubionych przepisów.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard
                            recipe={recipe}
                            isFavorite={favorites.has(recipe._id)}
                            loading={loading}
                            // Optimistic removal: przepis znika natychmiast
                            removeFavorite={async () => {
                                // Usuń lokalnie z listy
                                setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

                                try {
                                    await removeFavorite(recipe._id);
                                } catch (err) {
                                    // rollback w razie błędu
                                    setDisplayRecipes(prev => [...prev, recipe]);
                                    console.error("[FavoritesClient] Błąd podczas usuwania ulubionego:", err);
                                }
                            }}
                            addFavorite={async () => {
                                // W Favorites raczej rzadko używane, ale obsługiwane
                                try {
                                    await addFavorite(recipe._id);
                                } catch (err) {
                                    console.error("[FavoritesClient] Błąd podczas dodawania ulubionego:", err);
                                }
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
