// "use client";

// import { Box, Grid, Typography } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// import { ConfirmRemoveDialog, RecipeCard } from "@/components";
// import { gridSize, pageContainerStyle } from "./styles";
// import type { Recipe } from "@/types";
// import { useFavorites } from "@/hooks";
// import { useIsUserLogged } from "@/stores/useAdminStore";

// interface Props {
//     initialRecipes: Recipe[];
// }

// export default function FavoritesClient({ initialRecipes }: Props) {
//     const router = useRouter();
//     const isUserLogged = useIsUserLogged();
//     const { favorites, addFavorite, removeFavorite, loading } = useFavorites();

//     const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);
//     const [recipeToRemove, setRecipeToRemove] = useState<Recipe | null>(null);

//     // redirect jeśli user się wyloguje
//     useEffect(() => {
//         if (!isUserLogged) {
//             router.replace("/");
//         }
//     }, [isUserLogged, router]);

//     /* =====================
//        Handlers
//     ====================== */

//     const handleRequestRemove = (recipe: Recipe) => {
//         setRecipeToRemove(recipe);
//     };

//     const handleCancelRemove = () => {
//         setRecipeToRemove(null);
//     };

//     const handleConfirmRemove = async () => {
//         if (!recipeToRemove) return;

//         const recipe = recipeToRemove;
//         setRecipeToRemove(null);

//         // optimistic UI
//         setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

//         try {
//             await removeFavorite(recipe._id);
//         } catch (err) {
//             // rollback
//             setDisplayRecipes(prev => [...prev, recipe]);
//             console.error("[FavoritesClient] Remove failed:", err);
//         }
//     };

//     /* =====================
//        Render
//     ====================== */

//     if (displayRecipes.length === 0) {
//         return (
//             <Box sx={pageContainerStyle}>
//                 <Typography variant="h6" textAlign="center" mt={4}>
//                     Nie masz jeszcze ulubionych przepisów.
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <>
//             <Box sx={pageContainerStyle}>
//                 <Grid container spacing={3} justifyContent="center">
//                     {displayRecipes.map(recipe => (
//                         <Grid size={gridSize} key={recipe._id}>
//                             <RecipeCard
//                                 recipe={recipe}
//                                 isFavorite={favorites.has(recipe._id)}
//                                 loading={loading}
//                                 removeFavorite={() => handleRequestRemove(recipe)}
//                                 addFavorite={async () => {
//                                     try {
//                                         await addFavorite(recipe._id);
//                                     } catch (err) {
//                                         console.error("[FavoritesClient] Błąd podczas dodawania ulubionego:", err);
//                                     }
//                                 }}
//                             />
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>

//             <ConfirmRemoveDialog open={Boolean(recipeToRemove)} title={recipeToRemove?.title ?? ""} loading={loading} onCancel={handleCancelRemove} onConfirm={handleConfirmRemove} />
//         </>
//     );
// }

"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { RecipeCard } from "@/components";
import ConfirmRemoveDialog from "@/components/ConfirmRemoveDialog";
import { gridSize, pageContainerStyle } from "./styles";
import type { Recipe } from "@/types";
import { useFavorites } from "@/hooks";
import { useIsUserLogged } from "@/stores/useAdminStore";

/* =========================
   useConfirmDialog hook
========================= */

function useConfirmDialog<T>() {
    const [item, setItem] = useState<T | null>(null);

    const open = useCallback((value: T) => {
        setItem(value);
    }, []);

    const close = useCallback(() => {
        setItem(null);
    }, []);

    return {
        item,
        isOpen: item !== null,
        open,
        close,
    };
}

/* =========================
   FavoritesClient
========================= */

interface Props {
    initialRecipes: Recipe[];
}

export default function FavoritesClient({ initialRecipes }: Props) {
    const router = useRouter();
    const isUserLogged = useIsUserLogged();

    const { favorites, addFavorite, removeFavorite, loading } = useFavorites();
    const [displayRecipes, setDisplayRecipes] = useState<Recipe[]>(initialRecipes);

    const confirmDialog = useConfirmDialog<Recipe>();

    // CSR redirect if logged out
    useEffect(() => {
        if (!isUserLogged) {
            router.replace("/");
        }
    }, [isUserLogged, router]);

    /* =========================
       Handlers
    ========================= */

    const requestRemoveFavorite = useCallback(
        (recipe: Recipe) => {
            confirmDialog.open(recipe);
        },
        [confirmDialog]
    );

    const confirmRemoveFavorite = useCallback(async () => {
        if (!confirmDialog.item) return;

        const recipe = confirmDialog.item;
        confirmDialog.close();

        // optimistic UI
        setDisplayRecipes(prev => prev.filter(r => r._id !== recipe._id));

        try {
            await removeFavorite(recipe._id);
        } catch (err) {
            // rollback
            setDisplayRecipes(prev => [...prev, recipe]);
            console.error("[FavoritesClient] Remove failed:", err);
        }
    }, [confirmDialog, removeFavorite]);

    /* =========================
       Empty state
    ========================= */

    if (displayRecipes.length === 0) {
        return (
            <Box sx={pageContainerStyle}>
                <Typography variant="h6" textAlign="center" mt={4}>
                    Nie masz jeszcze ulubionych przepisów.
                </Typography>
            </Box>
        );
    }

    /* =========================
       Render
    ========================= */

    return (
        <Box sx={pageContainerStyle}>
            <Grid container spacing={3} justifyContent="center">
                {displayRecipes.map(recipe => (
                    <Grid size={gridSize} key={recipe._id}>
                        <RecipeCard recipe={recipe} isFavorite={favorites.has(recipe._id)} loading={loading} removeFavorite={() => requestRemoveFavorite(recipe)} addFavorite={() => addFavorite(recipe._id)} />
                    </Grid>
                ))}
            </Grid>

            <ConfirmRemoveDialog open={confirmDialog.isOpen} loading={loading} title={confirmDialog.item ? `Czy na pewno chcesz usunąć ${confirmDialog.item.title} z Ulubionych?` : ""} onConfirm={confirmRemoveFavorite} onCancel={confirmDialog.close} />
        </Box>
    );
}
